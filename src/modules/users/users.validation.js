import joi from "joi"


export const getUserByLinkSchema = joi.object({
  url: joi.string().pattern(/^http:\/\/localhost:3000\/[A-Za-z0-9_-]+$/).required()
})
export const updateProfileSchema = joi.object({
  firstName: joi.string().replace(/\s+/g, "").trim().pattern(/^[A-Za-z]+$/).min(3).max(15).optional(),
  lastName: joi.string().replace(/\s+/g, "").trim().pattern(/^[A-Za-z]+$/).min(3).max(15).optional(),
  gender : joi.string().trim().valid("male" , "female").optional(),
  age : joi.number().min(10).optional(),
  phone: joi.string().trim().pattern(/^[0-9]+$/).min(7).max(15).optional()
});
