import express from "express"
import { globalErrorHandler } from "./common/index.js"
import { connection } from "./database/index.js"
import { port } from "../config/index.js"
import { userRouter } from "./modules/users/index.js"
import cors from "cors"
import { messagesRouter } from "./modules/messages/index.js"
export const bootstrap = async () => {
  const app = express()
  app.use(express.json())
  app.use("/auth", userRouter)
  app.use("/messages", messagesRouter)
  await connection()
  app.use(cors())
  app.use('{*dummy}', (req, res) => res.status(404).json('invalid route'))
  app.use(globalErrorHandler)
  app.listen(port, () => {
    console.log("server is running");
  })
}  