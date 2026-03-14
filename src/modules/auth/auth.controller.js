import { Router } from "express";
import { forgetPassword, generateAccessesToken, getProfileViews, googleSignUp, logIn,  resetPassword,  signUp, twoStepVerfication, userById, verify } from "./index.js";
import { extentions, multer_local, SuccessResponse, UnauthorizedException } from "../../common/index.js";
import { auth, validation } from "../../common/index.js";
import {forgetPasswordSchema, logInSchema , resetPasswordSchema, signUpSchema, twoStepVerficationSchema, verifySchema} from "./auth.validation.js"

export const authRouter = Router()


authRouter.post("/signUp", multer_local({customPath : "Pfp" , maxSize : 5 , allowedExtentions : extentions.image}).single("Pfp"),validation(signUpSchema), async (req, res) => {
    let addedUser = await signUp(req.body , req.file)
    SuccessResponse({ res, status: 201, data: addedUser })
})


authRouter.post("/verify",validation(verifySchema),async(req,res)=>{
let data =await verify(req.body)
SuccessResponse({res , status:200 , message :"verified successfully", data})
})


authRouter.post("/logIn", validation(logInSchema), async (req, res) => {
    let loggedInUser = await logIn(req.body)
    SuccessResponse({ res, message: "logged in successfully", status: 302, data: loggedInUser })
})

authRouter.post("/two-step-verfication",validation(twoStepVerficationSchema),async(req,res)=>{
 let data = await twoStepVerfication(req.body)
 SuccessResponse({res,message:"loggedI successfully",status:200,data})
})

authRouter.get("/getUserById", auth, async (req, res) => {
    let user = await userById(req.userId)
    SuccessResponse({ res, message: "user found ", status: 302, data: user })
})

authRouter.post("/genrate-acceses-token", async (req, res) => {
    if (!req.headers.authorization) {
        throw UnauthorizedException({ message: "no token found", extra: "please insert token" })
    }
    let accesesToken = await generateAccessesToken(req.headers.authorization)
    SuccessResponse({ res, message: "generated successfully", data: accesesToken })
})
authRouter.post("/google-signUp", async (req, res) => {
    const data = await googleSignUp(req.body)
    SuccessResponse({ res, messages: "ok", data })
})

authRouter.get("/get-profile-views", auth, async (req, res) => {
    let profileView = await getProfileViews(req.userId)
    SuccessResponse({ res, message: "done", data: profileView })
}) 

authRouter.post("/forget-password",validation(forgetPasswordSchema),async(req,res)=>{
let data = await forgetPassword(req.body)
SuccessResponse({res,data,status:200})
})

authRouter.put("/reset-password",validation(resetPasswordSchema),async(req,res)=>{
 let data = await resetPassword(req.body)
 SuccessResponse({res,message:"password reset went successfully",status:200,data})
})