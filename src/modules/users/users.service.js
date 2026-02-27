import { findById, findOne, userModel } from "../../database/index.js"
import { BadRequestException, ConflictException, decodeRefreshToken, generateToken, NotFoundException, UnauthorizedException } from "../../common/index.js"
import { hashing, comparing } from "../../common/index.js"
import { adminSignature, tokenSecret, userSignature } from "../../../config/index.js"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"

export let signUp = async (data) => {
  let { fullName, email, password, } = data

  let exist = await findOne({ modelName: userModel, filter: { email } })

  if (exist) {
    return ConflictException({ message: "email already exist" })
  }
  let hashedPassword = await hashing(password)
  let addedUser = await userModel.insertOne({
    fullName,
    email,
    password: hashedPassword
  })
  return addedUser

}

export const logIn = async (data) => {
  let { email, password, providers } = data
  let exist = await findOne({ modelName: userModel, filter: { email, providers } })
  if (exist) {
    let isMatched = await comparing(password, exist.password)
    if (isMatched) {
      let { accesesToken, refreshToken } = generateToken(exist)
      return { exist, accesesToken, refreshToken }
    } else {
      return UnauthorizedException({ message: "invalide email or password" })
    }
  } else {
    return NotFoundException({ message: "user not found" })
  }
}

export const userById = async (id) => {
  let exist = await findById({ modelName: userModel, id })
  if (exist) {
    exist.viewCount += 1
    await exist.save()
    return exist
  } else {
    return NotFoundException({ message: "user not found" })
  }
}

export const generateAccessesToken = async (token) => {
  let { decodedData } = decodeRefreshToken(token)
  let signature = undefined
  switch (decodedData.aud) {
    case "Admin":
      signature = adminSignature
    default:
      signature = userSignature
  }
  let accesesToken = jwt.sign({ id: decodedData.id }, signature, {
    expiresIn: "30m",
    audience: decodedData.aud
  })
  return accesesToken
}
export const googleSignUp = async (data) => {

  let client = new OAuth2Client()
  const ticket = await client.verifyIdToken({
    idToken: data.idToken,
    audience: "clientId but i dont have one"
  })
  const payload = ticket.getPayload()
  if (payload.email_verified) {
    return payload
  } else {
    throw BadRequestException({ message: "email is not verified" })
  }
}

export const getProfileViews = async (id) => {
  let exist = await findById({ modelName: userModel, id })
  if (exist) {
    let { viewCount } = exist
    return viewCount
  } else {
    throw NotFoundException({ message: "user not found" })
  }
}