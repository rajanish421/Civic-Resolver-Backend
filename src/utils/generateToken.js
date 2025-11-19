const jwt = require('jsonwebtoken');

require("dotenv").config();

const generateToken = (user)=>{
    console.log(user._id);
    try {

        // payload that we want to include in the token
        const payload = {
            id:user._id,
            role:user.role,
            mobileNumber:user.mobileNumber
        };

        // token created
        const token = jwt.sign(payload , process.env.ACCESS_TOKEN_SECRET, {
            // expiry in 7 days
            expiresIn:'7d'
        });
        return token;

    } catch (error) {
        console.error('Token Generation Error:', error);
        throw new Error('Token Generation Failed');
    }
};

// send token to httpOnly cookie

const sendTokenToCookie = (res , token)=>{
    try {
            const cookieOptions = {
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production', // set secure flag in production
        sameSite:'Strict',
        maxAge:7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie('token' , token , cookieOptions);
    } catch (error) {
        console.error('Cookie Setting Error:', error);
        throw new Error('Setting Cookie Failed');
    }
};

// verify token function

const verifyToken = (token)=>{
    try {
        const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);
        return decoded;
    } catch (error) {
        console.error('Token Verification Error:', error);
        throw new Error('Token Verification Failed');
    }
};  

module.exports = {generateToken, sendTokenToCookie,verifyToken};