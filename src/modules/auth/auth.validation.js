import joi from "joi"

export const signUpSchema = joi.object({
    fullName: joi.string().min(6).max(30).pattern(/^\S+\s+\S+$/).required(),
    email: joi.string().email().required(),
    password: joi.string().trim().min(6).max(30).pattern(/^[a-zA-Z0-9]{6,30}$/).required(),
    sharedProfileName: joi.string().min(6).max(30).pattern(/^(?!.*\s)[a-zA-Z0-9_-]+$/).required(),
    pfp: joi.string().optional(),
    age: joi.number().min(10).optional(),
    phone: joi.string().trim().pattern(/^[0-9]+$/).min(7).max(15).optional(),
    gender: joi.string().trim().valid("male", "female").optional()
})
export const logInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(30).required(),
    providers: joi.string().required(),
    twoFa : joi.boolean().optional()
})

export const verifySchema = joi.object({
    email: joi.string().email().required(),
    code: joi.number().integer().min(1000).max(9999).required().messages({
        "number.base": "Code must be a number",
        "number.min": "Code must be at least 1000",
        "number.max": "Code must be at most 9999"
    })
})

export const forgetPasswordSchema = joi.object({
    email: joi.string().email().required()
})


export const resetPasswordSchema = joi.object({
    email: joi.string().email().required(),
    otp: joi.number().integer().min(1000).max(9999).required().messages({
        "number.base": "Code must be a number",
        "number.min": "Code must be at least 1000",
        "number.max": "Code must be at most 9999"
    }),
    newPassword: joi.string().trim().min(6).max(30).pattern(/^[a-zA-Z0-9]{6,30}$/).required()
})

export const twoStepVerficationSchema = joi.object({
     email: joi.string().email().required(),
    otp: joi.number().integer().min(1000).max(9999).required().messages({
        "number.base": "Code must be a number",
        "number.min": "Code must be at least 1000",
        "number.max": "Code must be at most 9999"
    })
})
