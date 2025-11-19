const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // expire-> in 5 min
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;