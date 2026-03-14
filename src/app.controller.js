import express from "express"
import { globalErrorHandler } from "./common/index.js"
import { connection, redisConnection } from "./database/index.js"
import { port } from "../config/index.js"
import { authRouter } from "./modules/auth/index.js"
import {userRouter} from "./modules/users/index.js"
import cors from "cors"
import { messagesRouter } from "./modules/messages/index.js"
import "./common/utils/corn.job.js"
export const bootstrap = async () => {
  const app = express()
  app.use(express.json())
  app.use("/auth", authRouter)
  app.use("/messages", messagesRouter)
  app.use("/users" , userRouter)
  await redisConnection()
  await connection()
  app.use(cors())
  app.use("/uploads" , express.static("uploads"))
  app.use('{*dummy}', (req, res) => res.status(404).json('invalid route'))
  app.use(globalErrorHandler)
  app.listen(port, () => {
    console.log("server is running");
  }) 
}    