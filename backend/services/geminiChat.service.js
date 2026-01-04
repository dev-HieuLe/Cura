import { GoogleGenerativeAI } from "@google/generative-ai";

let model = null;

function getModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  if (!model) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  return model;
}

/**
 * Initialize chat session
 */
export async function startChat(userInfo) {
  const prompt = `You are a friendly AI assistant. Greet the user warmly. User's name is ${userInfo.name}.`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("❌ Gemini startChat error:", err.message);
    return "Hello! Something went wrong. Please try again later.";
  }
}

/**
 * Continue chat session
 */
export async function continueChat(conversation, userMessage) {
  const conversationPrompt = conversation
    .map(
      (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
    )
    .join("\n");

  const prompt = `
You are a friendly AI assistant. Continue the conversation naturally.

Conversation so far:
${conversationPrompt}
User: ${userMessage}
Assistant:`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("❌ Gemini continueChat error:", err.message);
    return "Sorry, I couldn't process that. Could you rephrase?";
  }
}
