import { findById, findOne, get, redisDelete, set, userModel } from "../../database/index.js"
import { BadRequestException, ConflictException, decodeRefreshToken, event, generateToken, NotFoundException, UnauthorizedException } from "../../common/index.js"
import { hashing, comparing } from "../../common/index.js"
import { adminSignature, baseUrl, userSignature } from "../../../config/index.js"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"




export let signUp = async (data, file) => {
  let { fullName, email, password, sharedProfileName, age, phone, gender } = data
  if (gender == "male") {
    gender = "0"
  } else if (gender == "female") {
    gender = "1"
  }
  let names = fullName.trim().split(/\s+/)
  if (names.length < 2) {
    throw BadRequestException({ message: "fullname must be consists of first and last name between them space" })
  }
  let exist = await findOne({ modelName: userModel, filter: { email } })
  if (exist) {
    return ConflictException({ message: "email already exist" })
  }
  let image = `${baseUrl}/uploads/default/default.jpg`
  if (file) {
    image = `${baseUrl}/uploads/pfp/${file.filename}`
  }
  let hashedPassword = await hashing(password)
  let addedUser = await userModel.insertOne({
    fullName,
    email,
    password: hashedPassword,
    sharedProfileName,
    image,
    gender,
    phone,
    age
  })
  event.emit("verifyEmail", addedUser.id, email)
  return addedUser
}

export const logIn = async (data) => {
  let { email, password, providers , twoFa} = data
  let exist = await findOne({ modelName: userModel, filter: { email, providers } })
  if (exist) {
    if (exist.bannedFromLogIn == 5) {
      let bannedAt = Date.now()
      let afterFiveMinuet = bannedAt - 300
      if(bannedAt == afterFiveMinuet){
        exist.bannedFromLogIn = 0
        await exist.save()
      }
      let stillBanned = await get(`baned::${exist._id}`)
      if (stillBanned) {
        throw BadRequestException({ message: "you are still banned try again after 5 minute" })
      } else {
        await set({
          key: `baned::${exist._id}`,
          value: 1,
          ttl: 5 * 60
        })
        throw BadRequestException({ message: "you are baned from login for five minutes" })
      }
    }
    let isMatched = await comparing(password, exist.password)
    if (isMatched) {
      if(twoFa){
        event.emit("twoFa",exist._id , email)
        return "otp sent"
      }
      exist.bannedFromLogIn = "0"
      await exist.save()
      let { accesesToken, refreshToken } = await generateToken(exist)
      return { exist, accesesToken, refreshToken }
    } else {
      exist.bannedFromLogIn += 1
      await exist.save()
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
  let { decodedData } = await decodeRefreshToken(token)
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


export const verify = async ({ email, code }) => {
  let exist = await findOne({ modelName: userModel, filter: { email } })
  if (!exist) {
    throw NotFoundException({ message: "user not found" })
  }
  let redisKey = await get(`otp::${exist._id}`)
  if (!redisKey) {
    throw BadRequestException({ message: "verifcation code is expired please try again" })
  }
  code = String(code)
  if (await comparing(code, redisKey)) {
    let filter = { _id: exist._id }
    let update = { isVerified: true }
    let options = { new: true }
    exist = userModel.findByIdAndUpdate(filter, update, options)
    if (exist.isVerified == false) {
      throw BadRequestException({ message: "state isnt changed try verifing again" })
    } else if (exist.isVerified) {
      throw BadRequestException({ message: "user already verfied" })
    }
  } else {
    throw BadRequestException({ message: "wrong try verfing again" })
  }
  return exist
}

export const forgetPassword = async ({ email }) => {
  let exist = await findOne({ modelName: userModel, filter: { email } })
  if (!exist) {
    throw NotFoundException({ message: "user not found" })
  } else {
    event.emit("forgetPassword", exist._id, email)
    return "otp sent"
  }
}


export const resetPassword = async ({ newPassword, email, otp }) => {
  let exist = await findOne({ modelName: userModel, filter: { email } })
  console.log(exist);

  if (!exist) {
    throw NotFoundException({ message: "user not found" })
  } else {
    let hashedOtp = await get(`otp::${exist._id}`)
    otp = String(otp)
    if (await comparing(otp, hashedOtp)) {
      if (await comparing(newPassword, exist.password)) {
        throw BadRequestException({ message: "new password canot be as the same as old one" })
      } else {
        let hashedPassword = await hashing(newPassword)
        let filter = { _id: exist._id }
        let update = { password: hashedPassword }
        let options = { new: true }
        let updatedUser = userModel.findByIdAndUpdate(filter, update, options)
        if (!updatedUser) {
          throw BadRequestException({ message: "user nis nnot updated", extra: updatedUser })
        } else {
          await redisDelete(`otp::${exist._id}`)
          return updatedUser
        }
      }
    } else {
      throw BadRequestException({ message: "wrong otp try verifying again" })
    }
  }
}


export const twoStepVerfication = async({email , otp})=>{
 let exist = await findOne({modelName:userModel,filter:{email}})
 if(!exist){
  throw NotFoundException({message:"user not found"})
 }else{
   let hashedOtp = await get(`otp::${exist._id}`)
   otp = String(otp)
   if(await comparing(otp,hashedOtp)){
    exist.bannedFromLogIn = 0
    exist.twoFa = true
    await exist.save()
     let { accesesToken, refreshToken } = await generateToken(exist)
     await redisDelete(`otp::${exist._id}`)
     return {accesesToken , refreshToken , exist}
   }else{
    throw BadRequestException({message:"wrong otp try again"})
   }
 }
}