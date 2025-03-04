//TODO: need to update data
import nodemailer from "nodemailer"
import { emailTemplate } from "./emailTemplate.js";
import jwt from "jsonwebtoken";

export async function sendEmail(email){ 
    const transporter =  nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "saramahmoud7689@gmail.com",
        pass: "nyyq qyef nxtj megg",
    },
});

// async..await is not allowed in global scope, must use a wrapper
// async function main() {
  // send mail with defined transport object
    const myemail = jwt.sign(email, "myemail")

  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <saramahmoud7689@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "verify your email", // Subject line
    text: "testing verify email", // plain text body
    html: emailTemplate(myemail), // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

// main().catch(console.error);
// }