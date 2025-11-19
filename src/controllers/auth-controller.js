const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const User = require('../models/user-model');
const { generateToken, sendTokenToCookie } = require('../utils/generateToken');


// register controller
const registerController = async(req , res)=>{
    try{

        // destructure the req body
        // check empty fields
        // check if user already exists
        // hash the password
        // store the user in db
        // create jwt tokens
        // store in cookie
        // send response
        const { fullName , mobileNumber , password, aadharNumber } = req.body;

        console.log(req.body);

        if(!fullName || !mobileNumber || !password){
            return res.status(400).json({
                message:'All fields are required'
            });
        }  
        
        const user = await User.findOne({mobileNumber});

        if(user){
           return res.status(409).json({
                message:'User already exists'
            });
        }

        const passwordHash = await bcrypt.hash(password , 8);
        // const aadharNumberHash = await bcrypt.hash(aadharNumber , 8);
       
        // create new user object
        const newUser =new User({
            fullName,
            mobileNumber,
            password:passwordHash,
            aadharNumber: aadharNumber,
        });

        // save user to db
        await newUser.save();

        const token  = generateToken(newUser);

        sendTokenToCookie(res , token);

        res.status(201).json({
            status:'true',
            message:'User registered successfully',
            user:newUser,
        });

    }catch(err){
        console.error('Auth Controller Error:', err);
        res.status(500).json({
            status:'false',
            message:'Internal Server Error',
            error: err.message
        });
    }
};

module.exports = {registerController};




