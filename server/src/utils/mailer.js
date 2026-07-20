// import axios from "axios";
// export async function sendOtpEmail(to, otp) {
//   try {
//     await axios.post("https://api.brevo.com/v3/smtp/email", {
//       sender: { name: "Unalone", email: process.env.EMAIL_USER },
//       to: [{ email: to }],
//       subject: "Your verification code",
//       htmlContent: `<p>Your OTP is ${otp}</p>`,
//     },
//     {
//       headers: {
//         "api-key": process.env.BREVO_API_KEY,
//         "Content-Type": "application/json"
//       }
//     });
//   } catch (err) {
//     console.error("Failed to send OTP:", err);
//     throw err;
//   }
// }
