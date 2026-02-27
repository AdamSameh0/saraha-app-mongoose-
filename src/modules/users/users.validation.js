import joi from "joi"

export const signUpSchema = joi.object({
    fullName: joi.string().min(6).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(30).pattern(/^[a-zA-Z0-9]{6,30}$/).required()
})
export const logInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(30).required(),
    providers: joi.string().required()
})
