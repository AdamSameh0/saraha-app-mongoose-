import nodemailer from "nodemailer"
import { appEmail, appPassword } from "../../../../config/index.js";



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: appEmail,
    pass: appPassword,
  },
});



export let sendEmail = async ({
  to,
  subject,
  html
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"Sraha App" <${appEmail}>`,
      to,
      subject,
      html
    });
    console.log("Message sent:", info.messageId);
  } catch (err) {
    console.error("Detailed email error:", err);
    throw err;
  }
}



