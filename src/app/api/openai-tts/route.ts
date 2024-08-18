import { NextRequest, NextResponse } from "next/server";

import { OpenAI } from "openai";

export const POST = async (request: NextRequest) => {
    const openai = new OpenAI();

    const { text } = (await request.json()) as { text: string };

    const response = await openai.audio.speech.create({
        input: text,
        model: "tts-1",
        voice: "nova",
    });

    return new Response(response.body, {
        headers: {
            "Content-Type": response.type,
        },
    });
};
