
import { baseUrl } from "../../../config/env.service.js"
import { NotFoundException } from "../../common/index.js"
import { findById, findOne, userModel, set, get, ttl, redisDelete } from "../../database/index.js"
import fs from "fs"
import path from "path"


export const userProfile = async (userId) => {
   let exist = await get(`userProfile::${userId}`)
   if (exist) {
      return exist
   }
   exist = await findOne({ modelName: userModel, filter: { _id: userId }, select: "firstName lastName email sharedProfileName" })
   if (!exist) {
      throw NotFoundException({ message: "user not found" })
   }
   await set({
      key: `userProfile::${userId}`,
      value: exist,
      ttl: 300
   })
   const fullImageUrl = `${baseUrl}/${exist.image}`
   return { exist, fullImageUrl }
}

export const shareProfileLink = async (userId) => {
   let exist = await findOne({ modelName: userModel, filter: { _id: userId }, select: "firstName lastName email sharedProfileName" })
   if (!exist) {
      throw NotFoundException({ message: "user not found" })
   }
   const url = `${baseUrl}/${exist.sharedProfileName}`
   return url
}

export const getUserBySharedProfileLink = async (data) => {
   let { url } = data
   let sharedProfileName = url.split("/")[3]
   let exist = await findOne({ modelName: userModel, filter: { sharedProfileName }, select: "firstName lastName email" })
   if (exist) {
      return exist
   }
   throw NotFoundException({ message: "user not found" })
}

export const updateProfile = async (id, data, file) => {
   let exist = await findById({ modelName: userModel, id })
   if (!exist) {
      throw NotFoundException({ message: "user not found" })
   }
   let { firstName, lastName, gender, phone, age } = data
   firstName ? exist.firstName = firstName : null
   lastName ? exist.lastName = lastName : null
   phone ? exist.phone = phone : null
   age ? exist.age = age : null
   if (gender == "male") {
      gender = "0"
   } else if (gender == "female") {
      gender = "1"
   }
    if (file) {
    let image = exist.image;
    if (image !== `${baseUrl}/uploads/default/default.jpg`) {
      const filename = image.split("/").pop()
      const imagePath = path.resolve("uploads/Pfp", filename);
      try {
        await fs.promises.unlink(imagePath);
        console.log("Old file deleted:", imagePath);
      } catch (err) {
        if (err.code === "ENOENT") {
          console.warn("File not found:", imagePath);
        } else {
          throw err
        }
      }
    }

    exist.image = `${baseUrl}/uploads/${file.filename}`;
  }
   let savedUser = await exist.save()
   savedUser = JSON.stringify(savedUser)
    await set({
      key : `userProfile::${id}`,
      value : savedUser,
       ttl : 5 * 60
   })
   return savedUser
}

export const deleteProfile = async (userId) => {
   let deletedUser = await userModel.findByIdAndDelete({ _id: userId })
   if (deletedUser) {
      return deletedUser
   }
   throw NotFoundException({ message: "user not found" })
}

export const logOut = async (req) => {
   let redisKey = `revokeToken::${req.userId}::${req.token}`
   await set({
      key: redisKey,
      value: 1,
      ttl: req.decoded.iat + 30 * 60
   })
}

