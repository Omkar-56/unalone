import nodemailer from "nodemailer";

export async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_LOGIN,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Unalone <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your verification code",
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}
