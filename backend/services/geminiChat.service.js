import OpenAI from "openai";

let client = null;

function getClient() {
  if (!process.env.DEEPINFRA_API_KEY) {
    throw new Error("DEEPINFRA_API_KEY is missing");
  }

  if (!client) {
    client = new OpenAI({
      baseURL: "https://api.deepinfra.com/v1/openai",
      apiKey: process.env.DEEPINFRA_API_KEY,
    });
  }

  return client;
}

const MODEL = "deepseek-ai/DeepSeek-V4-Flash";

/**
 * Initialize chat session
 */
export async function startChat(userInfo) {
  const systemPrompt = `You are a friendly AI assistant. Greet the user warmly. User's name is ${userInfo.name}.`;

  try {
    const openai = getClient();
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: systemPrompt }],
    });
    return completion.choices[0].message.content;
  } catch (err) {
    console.error("❌ DeepInfra startChat error:", err.message);
    return "Hello! Something went wrong. Please try again later.";
  }
}

/**
 * Continue chat session
 */
export async function continueChat(conversation, userMessage) {
  const messages = [
    {
      role: "system",
      content:
        "You are a friendly AI assistant. Continue the conversation naturally.",
    },
    ...conversation.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  try {
    const openai = getClient();
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
    });
    return completion.choices[0].message.content;
  } catch (err) {
    console.error("❌ DeepInfra continueChat error:", err.message);
    return "Sorry, I couldn't process that. Could you rephrase?";
  }
}
