import jwt from "jsonwebtoken"
import { BadRequestException, decodeToken, UnauthorizedException } from "../index.js"
import {get} from "../../database/index.js"

export const auth = async(req, res, next) => {
    let { authorization } = req.headers
    if (!authorization) {
        throw UnauthorizedException({ message: "no token found" })
    }
    let decoded = jwt.decode(authorization)
    let { decodedData } = decodeToken(decoded, authorization)
   let revoked = await get(`revokeToken::${decoded.id}::${authorization}`)
   if(revoked !== null){
    throw BadRequestException({message:"token is already revoked",extra:"user logged out and the session ended"})
   }
    req.userId = decodedData.id
    req.token = authorization
    req.decoded = decoded

    next()
}