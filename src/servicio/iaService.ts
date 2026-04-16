import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Embeddings
export async function generateEmbedding(text: string): Promise<number[]> {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    const result = await model.embedContent(text);
    return result.embedding.values;
}

// Transformers
export async function generateTransformerResponse(prompt: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(`Explica brevemente el concepto de esta palabra o frase: ${prompt}`);
    return result.response.text();
}