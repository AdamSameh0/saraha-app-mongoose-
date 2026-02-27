import { Router } from "express";
import { generateAccessesToken, getProfileViews, googleSignUp, logIn, logInSchema, signUp, signUpSchema, userById } from "./index.js";
import { SuccessResponse, UnauthorizedException } from "../../common/index.js";
import { auth, validation } from "../../common/index.js";

export const userRouter = Router()


userRouter.post("/signUp", validation(signUpSchema), async (req, res) => {
    let addedUser = await signUp(req.body)
    SuccessResponse({ res, status: 201, data: addedUser })
})

userRouter.post("/logIn", validation(logInSchema), async (req, res) => {
    let loggedInUser = await logIn(req.body)
    let { accesesToken, refreshToken, exist } = loggedInUser
    SuccessResponse({ res, message: "logged in successfully", status: 302, data: { accesesToken, refreshToken, exist } })
})

userRouter.get("/getUserById", auth, async (req, res) => {
    let user = await userById(req.userId)
    SuccessResponse({ res, message: "user found ", status: 302, data: user })
})

userRouter.post("/genrate-acceses-token", async (req, res) => {
    if (!req.headers.authorization) {
        throw UnauthorizedException({ message: "no token found", extra: "please insert token" })
    }
    let accesesToken = await generateAccessesToken(req.headers.authorization)
    SuccessResponse({ res, message: "generated successfully", data: accesesToken })
})
userRouter.post("/google-signUp", async (req, res) => {
    const data = await googleSignUp(req.body)
    SuccessResponse({ res, messages: "ok", data })
})

userRouter.get("/get-profile-views", auth, async (req, res) => {
    let profileView = await getProfileViews(req.userId)
    SuccessResponse({ res, message: "done", data: profileView })
})