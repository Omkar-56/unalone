import axios from "axios";
export async function sendOtpEmail(email, otp) {
  try {
    await axios.post("https://api.brevo.com/v3/smtp/email", {
      sender: { name: "Unalone", email: process.env.EMAIL_USER },
      to: [{ email }],
      subject: "Your verification code",
      text: `Your OTP is ${otp}`,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    });
  } catch (err) {
    console.error("Failed to send OTP:", err);
    throw err;
  }
}
