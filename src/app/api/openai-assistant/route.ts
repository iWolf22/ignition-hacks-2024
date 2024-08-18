import { NextRequest, NextResponse } from "next/server";

import { OpenAI } from "openai";

export const POST = async (request: NextRequest) => {
    const openai = new OpenAI();

    const newMessage = await request.json();

    if (newMessage.threadId == null) {
        const thread = await openai.beta.threads.create();
        newMessage.threadId = thread.id;
    }

    await openai.beta.threads.messages.create(newMessage.threadId, {
        content: newMessage.content,
        role: "user",
    });

    const stream = await openai.beta.threads.runs.create(newMessage.threadId, {
        assistant_id: process.env.OPENAI_ASSISTANT_ID!,
        stream: true,
    });

    return new Response(stream.toReadableStream());
};
