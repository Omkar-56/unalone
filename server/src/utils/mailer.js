import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(email, otp) {
  const { data, error } = await resend.emails.send({
    from: `Unalone <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your verification code",
    text: `Your OTP is ${otp}`,
  });

  if (error) {
    console.error("Error sending email:", error);
  } else {
    console.log("Email sent:", data);
  }
}
