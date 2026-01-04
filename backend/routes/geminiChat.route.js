import express from "express";
import { startChat, continueChat } from "../services/geminiChat.service.js";

const router = express.Router();

// Temporary in-memory session store
const sessions = {};

/**
 * Start chat session
 */
router.post("/start", async (req, res) => {
  const { sessionId, userInfo } = req.body;
  if (!sessionId || !userInfo?.name) {
    return res
      .status(400)
      .json({ error: "sessionId and userInfo.name required" });
  }

  try {
    const greeting = await startChat(userInfo);
    sessions[sessionId] = [{ role: "assistant", content: greeting }];
    res.json({ message: greeting });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start chat" });
  }
});

/**
 * Send message in existing chat session
 */
router.post("/message", async (req, res) => {
  const { sessionId, message } = req.body;
  if (!sessionId || !message) {
    return res.status(400).json({ error: "sessionId and message required" });
  }

  try {
    const conversation = sessions[sessionId] || [];
    conversation.push({ role: "user", content: message });

    const reply = await continueChat(conversation, message);
    conversation.push({ role: "assistant", content: reply });

    sessions[sessionId] = conversation;
    res.json({ message: reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
