import { createOpenAI } from "@ai-sdk/openai";

export const openAI = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
