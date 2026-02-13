import dotenv from "dotenv"

dotenv.config({path: "./config/.env"})

export const uri = process.env.URI
export const port = process.env.PORT
export const Mood = process.env.MOOD
export const salt = process.env.SALT
export const tokenSecret = process.env.TOKENSECRET