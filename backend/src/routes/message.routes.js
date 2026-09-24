import { Router } from "express";
import { listMessages, streamMessages } from "../controllers/message.controller.js";

export const messageRouter = Router();

messageRouter.get("/stream", streamMessages);
messageRouter.get("/", listMessages);
