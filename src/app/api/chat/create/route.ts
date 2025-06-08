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
    // Prepare the chat data to be saved in db
    const chatData = {
      userId,
      message: [],
      name: "New Chat",
    };
    // connect db
    await connectDB();
    await Chat.create(chatData);
    return NextResponse.json({ success: true, message: "Chat created" });
  } catch (err: unknown) {
    console.error("Err: ", err);
    return NextResponse.json({ success: false, err: err });
  }
}
