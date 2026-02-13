import { findById, findOne, userModel } from "../../database/index.js"
import { ConflictException, NotFoundException, UnauthorizedException } from "../../common/utils/responce/index.js"
import {hashing , comparing} from "../../common/hash/index.js"
import { tokenSecret } from "../../../config/index.js"
import jwt from "jsonwebtoken"

export let signUp = async(data)=>{
  let {fullName , email , password ,} = data

  let exist = await findOne({modelName : userModel , filter : { email }})

  if(exist){
    return ConflictException({message:"email already exist"})
  }
     let hashedPassword = await hashing(password)
      let addedUser = await userModel.insertOne({
        fullName , 
        email,
        password:hashedPassword
      })
      return addedUser
  
}

export const logIn = async(data)=>{
 let {email , password , providers} = data
   let exist = await findOne({modelName : userModel , filter : { email , providers }})
   if(exist){
   let isMatched = await comparing(password , exist.password)
   if(isMatched){
   let token  = jwt.sign({id:exist._id},tokenSecret)
   return {exist , token}
   }else{
    return UnauthorizedException({message:"invalide email or password"})
   }
   }else{
    return NotFoundException({message:"user not found"})
   }
}

export const userById = async(headers)=>{

  let {authorization} = headers
 
  let decoded = jwt.verify(authorization,tokenSecret)
  console.log(decoded);
  let exist = await findById({modelName : userModel , id:decoded.id}) 
  if(exist){
    return exist
  }else{
    return NotFoundException({message:"user not found"})
  }
}