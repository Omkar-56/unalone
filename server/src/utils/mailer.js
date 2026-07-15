import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("SMTP verification failed:", err);
  } else {
    console.log("SMTP server ready");
  }
});

export async function sendOtpEmail(email, otp) {
  try {
    await transporter.sendMail({
      from: `Unalone <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your verification code",
      text: `Your OTP is ${otp}`,
    });
  } catch (err) {
    console.error("Failed to send OTP:", err);
    throw err;
  }
}
