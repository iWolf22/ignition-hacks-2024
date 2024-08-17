import { NextRequest, NextResponse } from "next/server";

import { openai } from "../../../utils/openai";

export const POST = async (request: NextRequest) => {
    const { text } = (await request.json()) as { text: string };

    const response = await openai.audio.speech.create({
        input: text,
        model: "tts-1",
        voice: "alloy",
    });

    return new Response(response.body, {
        headers: {
            "Content-Type": response.type,
        },
    });
};
