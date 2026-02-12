import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(email, otp) {
  await transporter.sendMail({
    from: `Unalone <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your verification code",
    text: `Your OTP is ${otp}`,
  });
}
