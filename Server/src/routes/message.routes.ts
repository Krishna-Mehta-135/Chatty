import express from "express";
import { protect } from "../middlewares/auth.middleware";
import { getMessages, getUsersForSidebar, sendMessages } from "../controllers/message.controller";

const messageRouter = express.Router()

messageRouter.get("/users", protect, getUsersForSidebar)
messageRouter.get("/:id" , protect, getMessages)

messageRouter.post("/send/:id", protect, sendMessages)

export default messageRouter;