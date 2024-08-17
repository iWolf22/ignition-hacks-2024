"use client";

import { useRef, useState } from "react";

interface Message {
    content: string;
    createdAt: Date;
    id: string;
    role: string;
}

const OpenAIAssistant = ({
    assistantId = "",
    greeting = "I am a helpful physiotherapy assistant. How can I help you?",
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [threadId, setThreadId] = useState<null | string>(null);
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [streamingMessage, setStreamingMessage] = useState<Message>({
        content: "_Thinking..._",
        createdAt: new Date(),
        id: "Thinking...",
        role: "assistant",
    });
    const messageId = useRef(0);

    return <div>ASDF</div>;
};

export default OpenAIAssistant;
