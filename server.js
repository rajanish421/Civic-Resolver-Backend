const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/api/v1/routes/auth-routes');
const otpRoutes = require('./src/api/v1/routes/otp-routes');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());




// All Routes
app.use("/api/v1/user",authRoutes);

app.use("/api/v1/user",otpRoutes);




// Database connection
mongoose.connect(process.env.MONGODB_URL).then(() => {
    
    console.log('MongoDB Connected');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}).catch((error) => {

  console.error('MongoDB Connection Error:', error);
  process.exit(1); // Stop app on DB failure

});


