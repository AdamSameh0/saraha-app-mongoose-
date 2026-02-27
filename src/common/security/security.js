import jwt from "jsonwebtoken"
import { userSignature, adminSignature, adminRefreshSignature, userRefreshSignature } from "../../../config/index.js"


export const generateToken = (user) => {
  let signature = undefined
  let audience = undefined
  let refreshSignature = undefined
  switch (user.role) {
    case "0":
      signature = adminSignature
      refreshSignature = adminRefreshSignature
      audience = "Admin"
      break
    default:
      signature = userSignature
      refreshSignature = userRefreshSignature
      audience = "User"
  }
  let refreshToken = jwt.sign({ id: user._id }, refreshSignature, {
    expiresIn: "1y",
    audience
  })
  let accesesToken = jwt.sign({ id: user._id }, signature, {

    expiresIn: "30m",
    audience
  })
  return { accesesToken, refreshToken }
}

export const decodeToken = (decoded, token) => {
  let signature = undefined
  switch (decoded.aud) {
    case "Admin":
      signature = adminSignature
    default:
      signature = userSignature
  }
  let decodedData = jwt.verify(token, signature)
  return { decodedData }
}


export const decodeRefreshToken = (token) => {
  let decoded = jwt.decode(token)
  let refreshSignature = undefined
  switch (decoded.aud) {
    case "Admin":
      refreshSignature = adminRefreshSignature
    default:
      refreshSignature = userRefreshSignature
  }
  let decodedData = jwt.verify(token, refreshSignature)
  return { decodedData }
}