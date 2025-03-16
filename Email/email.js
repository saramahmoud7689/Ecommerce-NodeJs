const nodemailer = require("nodemailer")
const { emailTemplate } = require("./emailTemplate.js");
const jwt = require("jsonwebtoken");

exports.sendEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "saramahmoud7689@gmail.com",
      pass: "nyyq qyef nxtj megg",
    },
  });

  const myemail = jwt.sign(email, "myemail")
  console.log(myemail)
  // myemail = myemail.split["."][0];

  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <saramahmoud7689@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "verify your email", // Subject line
    text: "testing verify email", // plain text body
    html: emailTemplate(myemail), // html body
  });

  console.log("Message sent: %s", info.messageId);
}