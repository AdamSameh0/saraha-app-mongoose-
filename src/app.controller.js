import express from "express"
import { globalErrorHandler } from "./common/utils/responce/index.js"
import { connection } from "./database/index.js"
import { port } from "../config/index.js"
import { userRouter } from "./modules/users/users.controller.js"

export const bootstrap = async()=>{
  const app = express()
  app.use(express.json())
  app.use("/auth",userRouter)
    await connection()
    app.use('{*dummy}',(req,res)=>res.status(404).json('invalid route'))
  app.use(globalErrorHandler)
  app.listen(port,()=>{
    console.log("server is running");
  })
}  