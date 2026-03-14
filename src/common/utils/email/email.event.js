import { EventEmitter } from "events"
import { hashing } from "../../index.js"
import { sendEmail } from "./email.js"
import { set } from "../../../database/index.js"


export const event = new EventEmitter()


event.on("verifyEmail", async (userId, email) => {
  let code = Math.floor(Math.random() * 10000)
  code = code.toString().padEnd(4, 0)
  await set({
    key: `otp::${userId}`,
    value: await hashing(code),
    ttl: 60 * 3
  })

  await sendEmail({
    to: email,
    subject: "verify your sraha account",
    html: `<h1>hello to sraha</h1> 
           <p> ${code} </p>
        `
  })
})

event.on("forgetPassword", async (userId , email) => {
  let code = Math.floor(Math.random() * 10000)
  code = code.toString().padEnd(4, 0)
  await set({
    key: `otp::${userId}`,
    value: await hashing(code),
    ttl: 60 * 3
  })
  await sendEmail({
    to: email,
    subject: "verify your email to reset your password",
    html: `<h1>verify your email to reset your password</h1>
        <p>${code}</p>   
      `
  })
})


event.on("twoFa", async (userId , email) => {
  let code = Math.floor(Math.random() * 10000)
  code = code.toString().padEnd(4, 0)
  await set({
    key: `otp::${userId}`,
    value: await hashing(code),
    ttl: 60 * 3
  })
  await sendEmail({
    to: email,
    subject: "complete two step verfication",
    html: `<h1>complete two step verfication</h1>
        <p>${code}</p>   
      `
  })
})
