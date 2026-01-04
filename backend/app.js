import express from "express";
import cors from "cors";
import recommendRoutes from "./routes/recommend.route.js";
import pdfRoute from "./routes/pdf.route.js";
import dotenv from "dotenv";
dotenv.config();
import geminiChatRoutes from "./routes/geminiChat.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/recommend", recommendRoutes);
app.use("/api/pdf", pdfRoute);
app.use("/api/gemini-chat", geminiChatRoutes);

export default app;
