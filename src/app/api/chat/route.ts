import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";
import { appendUserRowToSheet } from "@/lib/googleSheets";

// Note: Removed "export const runtime = 'edge'" to allow full compatibility 
// with Node.js APIs used by the googleapis library.

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: '"messages" must be an array' }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const result = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are SpeechiFy, a friendly and highly capable chatbot assistant that helps users and collects their inquiries. " +
        "Your mission is to gather three pieces of basic information from the user: " +
        "1. Their Full Name\n" +
        "2. Their Email Address\n" +
        "3. Their Inquiry/Question or the topic they want assistance with.\n\n" +
        "Be extremely natural, friendly, and conversational. Do not ask for all the details in a single dry question; " +
        "instead, greet them and guide them through a polite conversation. You can also accept their answers all at once if they offer it. " +
        "Once (and ONLY once) you have successfully collected ALL three pieces of information (Name, Email, and Inquiry), " +
        "you MUST immediately execute the `saveUserInfo` tool to store their details in our Google Sheets database. " +
        "After the tool returns a successful result, warmly let the user know that their request has been registered and that our team will contact them soon regarding their inquiry. Thank them for reaching out.",
      messages,
      tools: {
        saveUserInfo: {
          description:
            "Saves the gathered user lead information (Name, Email, and Inquiry summary) to the Google Sheet.",
          parameters: z.object({
            name: z.string().describe("The user's full name"),
            email: z.string().describe("The user's email address"),
            inquiry: z
              .string()
              .describe(
                "A brief summary of the user's inquiry, question, or purpose of contact."
              ),
          }),
          execute: async ({ name, email, inquiry }) => {
            const res = await appendUserRowToSheet(name, email, inquiry);
            if (!res.success) {
              throw new Error(res.error || "Failed to save to Google Sheets.");
            }
            return {
              success: true,
              message: "Successfully saved to Google Sheets.",
            };
          },
        },
      },
      maxSteps: 5, // Allows automatic tool execution and subsequent response generation
    });

    return new Response(
      JSON.stringify({ text: result.text }), // returning as JSON
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error with OpenAI / Google Sheets request:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process chat request",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
