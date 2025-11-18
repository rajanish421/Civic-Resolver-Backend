const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:String,
        required:true,
        unique:true
    },
    aadharNumberHash:{
        type:String,
        required:true,
        unique:true,
    },
    passwordHash:{
        type:String,
        required:true 
    },
    role:{
        type:String,
        enum:['citizen','dept_admin','field_worker','dept_worker'],
        default:'citizen' 
    },
    departmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department',
        default:null 
    },

});

const User = mongoose.model('User', userSchema);

module.exports = User;