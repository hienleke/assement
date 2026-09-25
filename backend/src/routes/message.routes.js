import { Router } from "express";
import { streamMessages } from "@/controllers/message.controller.js";

export const messageRouter = Router();

messageRouter.get("/stream", streamMessages);
