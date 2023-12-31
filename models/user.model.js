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
        },
        password:
        {
            type: String,
            required:true
        },
        mobileNumber:
        {
            type: String,
        }
    });
const usermodel=db2.model('users',userSchema);
module.exports=usermodel;