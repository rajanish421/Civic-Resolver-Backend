const express = require('express');
const { registerController } = require('../../../controllers/auth-controller');


const authRoutes = express.Router();

// register route

authRoutes.post("/register" , registerController);


module.exports = authRoutes;