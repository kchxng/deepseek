import connectDB from "@/config/infra/db";
import Chat from "@/config/models/chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not autenticated",
      });
    }

    const { chatId, name } = await req.json();
    // Modify data
    await connectDB();
    await Chat.findByIdAndUpdate({ _id: chatId, userId: userId }, { name });
    return NextResponse.json({ success: true, message: "Chat renamed" });
  } catch (err) {
    console.error("Err: ", err);
    return NextResponse.json({ success: false, err: err });
  }
}
