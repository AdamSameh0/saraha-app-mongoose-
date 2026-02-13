import { Router } from "express";
import { logIn, signUp, userById } from "./users.service.js";
import { SuccessResponse } from "../../common/utils/responce/index.js";

export const userRouter = Router()


userRouter.post("/signUp",async(req,res)=>{
     let addedUser = await signUp(req.body)
     SuccessResponse({res , status : 201 , data : addedUser})
})

userRouter.post("/logIn",async(req,res)=>{
    let loggedInUser = await logIn(req.body)
    let {token , exist} = loggedInUser
    SuccessResponse({res , message:"logged in successfully", status:302 , data : {token , exist}})
})

userRouter.get("/getUserById",async(req,res)=>{
 let user = await userById(req.headers)
 SuccessResponse({res , message :"user found " , status : 302 ,data : user})
})