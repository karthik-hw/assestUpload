const {db2}=require('../config/mongoSetup');
const mongoose=require('mongoose');
const Schema=mongoose.Schema
const userSchema=new Schema(
    {
        name:
        {
            type: String,
            required:true
        },
        email:
        {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
        },
        password:
        {
            type: String,
            required:true,
            match:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'Password must be min 8 length and 1 uppercase , 1 lowercase,1 numeric,1 special symbol']
        },
        mobileNumber:
        {
            type: String,
            required:true,
            match:[/^\d{10}$/,'give valid mobile number']
        }
    });
const usermodel=db2.model('users',userSchema);
module.exports=usermodel;