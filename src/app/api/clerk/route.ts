import { Webhook } from "svix";
import connectDB from "@/config/infra/db";
import User from "@/config/models/user";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const wh = new Webhook(process.env.SIGNING_SECRET as string);
  const headerPayload = await headers();
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id") ?? "",
    "svix-signature": headerPayload.get("svix-signature") ?? "",
    "svix-timestamp": headerPayload.get("svix-timestamp") ?? "", // Required by Svix!
  };

  // get the payload and verify it
  //   const payload = await req.json();
  // Get the payload and verify it
  const payload = await req.text(); //  Use `text()` instead of `json()` to preserve signature integrity
  let event: { data: any; type: string };
  try {
    event = wh.verify(payload, svixHeaders) as any;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data, type } = event;

  //   const body = JSON.stringify(payload);
  //   const { data, type }: any = wh.verify(body, svixHeaders as any);
  // Prepare the user data to saved in db
  const userData = {
    _id: data.id,
    email: data.email_addresses[0].email_address,
    name: `${data.first_name} ${data.last_name}`,
    image: data.image_url,
  };

  await connectDB();

  //   try {
  switch (type) {
    case "user.created":
      await User.create(userData);
      break;
    case "user.updated":
      await User.findByIdAndUpdate(data.id, userData);
      break;
    case "user.deleted":
      await User.findByIdAndDelete(data.id);
      break;
    default:
      console.log("Unhandled webhook event type:", type);
      break;
  }
  //   } catch (dbErr) {
  //     console.error("Database operation failed:", dbErr);
  //     return new NextResponse("Server Error", { status: 500 });
  //   }
  return NextResponse.json({ message: "Event received" });
}
