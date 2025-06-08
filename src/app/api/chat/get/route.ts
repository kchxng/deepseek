import connectDB from "@/config/infra/db";
import Chat from "@/config/models/chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not autenticated",
      });
    }
    //fetch data
    await connectDB();
    const data = await Chat.find({ userId });
    return NextResponse.json({ success: true, data: data });
  } catch (err) {
    console.error("Err: ", err);
    return NextResponse.json({ success: false, err: err });
  }
}
