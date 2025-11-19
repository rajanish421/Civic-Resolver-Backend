require("dotenv").config();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);


// SEND OTP (using Verify API)
const sendOtpController = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        if (!mobileNumber) {
            return res.status(400).json({ message: "Mobile number is required" });
        }

        // Twilio verify send OTP
        const response = await client.verify.v2
            .services(verifyServiceSid)
            .verifications
            .create({
                to: mobileNumber.startsWith("+") ? mobileNumber : `+91${mobileNumber}`,
                channel: "sms"
            });

        return res.status(200).json({
            status: true,
            message: "OTP sent successfully",
            // verification_sid: response.sid   // optional debug
        });

    } catch (error) {
        console.error("Send OTP Error:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to send OTP",
            error: error.message
        });
    }
};

// VERIFY OTP (using Verify API)
const verifyOtpController = async (req, res) => {
    try {
        const { mobileNumber, otp } = req.body;

        if (!mobileNumber || !otp) {
            return res.status(400).json({
                message: "Mobile number and OTP are required"
            });
        }

        // Verify OTP using Twilio Verify
        const verification = await client.verify.v2
            .services(verifyServiceSid)
            .verificationChecks
            .create({
                to: mobileNumber.startsWith("+") ? mobileNumber : `+91${mobileNumber}`,
                code: otp
            });

        if (verification.status === "approved") {
            return res.status(200).json({
                status: true,
                message: "OTP verified successfully"
            });
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid OTP / Expired OTP"
            });
        }

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to verify OTP",
            error: error.message
        });
    }
};

module.exports = { sendOtpController, verifyOtpController };
