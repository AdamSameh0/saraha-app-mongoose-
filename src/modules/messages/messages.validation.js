import joi from "joi"


export const sendfMessageSchema = joi.object({
    message: joi.string().min(10).max(500).required(),
    image: joi.string().optional()
})