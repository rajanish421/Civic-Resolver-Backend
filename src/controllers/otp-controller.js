const express = require('express');
require('dotenv').config();
const twilio = require('twilio');
const OTP = require('../models/otp-model');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

// send OTP controller
const sendOtpController = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        if (!mobileNumber) {
            return res.status(400).json({
                message: 'Mobile number is required'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in database
        console.log(mobileNumber, otp);
        await OTP.findOneAndUpdate(
            { mobileNumber },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );  

        // send OTP via Twilio
        await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: twilioPhone,
            to: mobileNumber
        });

        res.status(200).json({
            status: 'true',
            message: 'OTP sent successfully',
            otp // In production, do not send OTP in response
        });

    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({
            message: 'Failed to send OTP'
        });
    }
};

// verify OTP controller

const verifyOtpController = async (req, res) => {
    try {
        const { mobileNumber, otp } = req.body;

        if (!mobileNumber || !otp) {
            return res.status(400).json({
                message: 'Mobile number and OTP are required'
            });
        }

        const record = await OTP.findOne({ mobileNumber });

        if (!record || record.otp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP or Expired'
            });
        }

        // OTP is valid
        // await otpModel.deleteOne({ mobileNumber }); // Remove used OTP

        res.status(200).json({
            status: 'true',
            message: 'OTP verified successfully'
        });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({
            message: 'Failed to verify OTP'
        });
    }
};

module.exports = { sendOtpController  , verifyOtpController };
