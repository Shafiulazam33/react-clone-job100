const nodemailer = require("nodemailer");
async function doemail(email, token, resetLink) {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 465,
    service: "yahoo",
    secure: false,
    tls: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
    debug: false,
    logger: true,
  });
  let link, subText;
  if (resetLink) {
    link = `https://localhost:4000/api/profile/password-reset?token=${token}&email=${email}`;
    subText = "Password-Reset On React-Jobs-Clone";
  } else {
    link = `https://localhost:4000/api/profile/email-verification?token=${token}`;
    subText = "Email Verification For React-Jobs-Clone";
  }

  let info = await transporter.sendMail({
    from: `<${process.env.EMAIL}>`, // sender address
    to: email, // list of receivers
    subject: subText, // Subject line
    html: `<a href="${link}">${link}</a>`, // html body
  });

  return info;
}
module.exports.doemail = doemail;
