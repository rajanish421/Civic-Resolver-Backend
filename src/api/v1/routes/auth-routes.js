const express = require('express');
const { registerController, loginController } = require('../../../controllers/auth-controller');


const authRoutes = express.Router();

// register route
authRoutes.post("/register" , registerController);


// login route
authRoutes.post("/login" , loginController);

module.exports = authRoutes;