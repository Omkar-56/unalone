import nodemailer from "nodemailer";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  service: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("STMP verification failed:", err);
  } else {
    console.log("SMTP verified:", success);
  }
});

export async function sendOtpEmail(email, otp) {
  await transporter.sendMail({
    from: `Unalone <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your verification code",
    text: `Your OTP is ${otp}`,
  });
}
