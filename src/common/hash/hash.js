import { compare, hash } from "bcrypt"
import { salt } from "../../../config/index.js"

export const hashing = async (plainText) => {
  let hashed = await hash(plainText, Number(salt))
  return hashed
}

export const comparing = async (palinText, hashedtext) => {
  let isMatched = await compare(palinText, hashedtext)
  return isMatched
}