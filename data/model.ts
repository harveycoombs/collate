import ollama from "ollama";

interface ModelOptions {
    model: string;
    prompt?: string;
    messages?: any[];
    style?: "verbose" | "concise" | "balanced" | null;
}

interface VisionModelOptions {
    model?: string;
    image?: File;
}

export async function generate({ model, prompt }: ModelOptions): Promise<string|null> {
    if (!model?.length || !prompt?.length) return null;

    let response = await ollama.chat({
        model: model,
        messages: [{ role: "user", content: prompt.trim() }]
    });

    return response?.message?.content;
}

export async function generateFromContext({ model, messages, style }: ModelOptions): Promise<string|null> {
    if (!model?.length || !messages?.length) return null;

    let responseStyle = (style == "balanced") ? "" : `${style}ly`;
    let responseLength = (style == "concise") ? 20 : (style == "verbose") ? 60 : 40;

    let response = await ollama.chat({
        model: model,
        messages: messages.map(message => ({ role: message.you ? "user" : "assistant", content: `Respond ${responseStyle} to the following message: ${message.content.trim()}, in ${responseLength} words or less. Do not hallucinate or speak in any other language than English.` }))
    });

    return response?.message?.content;
}

export async function generateFromImage({ model, image }: VisionModelOptions): Promise<string|null> {
    if (!model?.length || !image || !(image instanceof File)) return null;

    let buffer = await image.arrayBuffer();

    let response = await ollama.chat({
        model: model,
        messages: [{ role: "user", content: `Analyze the attached image: ${image.name}`, images: [new Uint8Array(buffer)] }]
    });

    return response?.message?.content;
}