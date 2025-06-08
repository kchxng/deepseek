import connectDB from "@/config/infra/db";
import Chat from "@/config/models/chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

//
export const macDuration = 60; // 60 seconds
const openai = new OpenAI({
  baseURL: process.env.DEEPSEEK_URL || "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    //
    const { chatId, prompt } = await req.json();
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not autenticated",
      });
    }
    await connectDB();
    const data = await Chat.findOne({ userId, _id: chatId });
    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };
    data.message.push(userPrompt);
    // call DeepSeek API
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "deepseek-chat",
      store: true,
    });
    const message = completion.choices[0].message;
    // message.timestamp = Date.now();
    data.message.push(message);
    console.log("push data,", JSON.stringify(data));
    data.save();
    return NextResponse.json({ success: true, data: message });
  } catch (err) {
    console.error("Err: ", err);
    return NextResponse.json({ success: false, err: err });
  }
}
