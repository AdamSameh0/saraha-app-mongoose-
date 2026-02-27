import { Router } from "express";
import { deleteMessageById, getAllMessages, getMessageById, sendfMessageSchema, sendingMessage } from "./index.js";
import { auth, BadRequestException, SuccessResponse, UnauthorizedException, validation } from "../../common/index.js";

export const messagesRouter = Router()


messagesRouter.post("/send-message/:id", validation(sendfMessageSchema), async (req, res) => {
   if (!req.params.id) {
      throw UnauthorizedException({ message: "no id sent" })
   }
   let message = await sendingMessage(req.body, req.params.id)
   SuccessResponse({ res, message: "message sent successfully", data: message })
})

messagesRouter.get("/get-all-messages", auth, async (req, res) => {
   let messages = await getAllMessages(req.userId)
   SuccessResponse({ res, message: "done", data: messages })
})

messagesRouter.get("/get-message-by-id/:messageId", auth, async (req, res) => {
   if (!req.params.messageId) {
      throw BadRequestException({ message: "no message id sent" })
   }
   let message = await getMessageById(req.userId, req.params.messageId)
   SuccessResponse({ res, message: "done", data: message })
})

messagesRouter.delete("/delete-message-by-id/:messageId", auth, async (req, res) => {
   if (!req.params.messageId) {
      throw BadRequestException({ message: "no message id found" })
   }
   let deltedMessage = await deleteMessageById(req.userId, req.params.messageId)
   SuccessResponse({ res, message: "deleted successfully" })
})