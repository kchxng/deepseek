import connectDB from "@/config/infra/db";
import Chat from "@/config/models/chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const { chatId } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not autenticated",
      });
    }

    // Delete data
    await connectDB();
    await Chat.deleteOne({ _id: chatId, userId: userId });
    return NextResponse.json({ success: true, message: "Chat deleted" });
  } catch (err) {
    console.error("Err: ", err);
    return NextResponse.json({ success: false, err: err });
  }
}
