import express from "express";
import { recommend } from "../controllers/recommend.controller.js";

const router = express.Router();

router.post("/", recommend);

export default router;
