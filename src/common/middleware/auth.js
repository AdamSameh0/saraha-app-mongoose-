import jwt from "jsonwebtoken"
import { decodeToken, UnauthorizedException } from "../index.js"

export const auth = (req, res, next) => {
    let { authorization } = req.headers
    if (!authorization) {
        throw UnauthorizedException({ message: "no token found" })
    }
    let decoded = jwt.decode(authorization)
    let { decodedData } = decodeToken(decoded, authorization)
    req.userId = decodedData.id
    next()
}