import dotenv from "dotenv"

dotenv.config({ path: "./config/.env" })

export const uri = process.env.URI
export const port = process.env.PORT
export const Mood = process.env.MOOD
export const salt = process.env.SALT
export const tokenSecret = process.env.TOKENSECRET
export const userSignature = process.env.JWT_USER_SIGNATURE
export const adminSignature = process.env.JWT_ADMIN_SIGNATURE
export const adminRefreshSignature = process.env.JWT_ADMIN_REFRESH_SIGNATURE
export const userRefreshSignature = process.env.JWT_USER_REFRESH_SIGNATURE



