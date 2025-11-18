const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Civic Resolver Backend is running');
});


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


