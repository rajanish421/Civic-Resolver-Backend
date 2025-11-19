const express = require('express');
const { sendOtpController, verifyOtpController } = require('../../../controllers/otp-controller');


const otpRoutes = express.Router();

// send otp route
otpRoutes.post("/send-otp" , sendOtpController);

// verify otp route
otpRoutes.post("/verify-otp" , verifyOtpController);


module.exports = otpRoutes;