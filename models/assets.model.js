const {db1}=require('../config/mongoSetup');
const mongoose=require('mongoose');
const Schema=mongoose.Schema
const assetSchema=new Schema(
    {
        fileName:
        {
            type: String,
            required:true
        },
        projectName:
        {
            type: String,
            required: true,
        },
        uploadedBy:
        {
            type: String,
            required:true
        },
        fileid:
        {   
            type: String,
            required: true
        }
    });
const assetsmodel=db1.model('assets',assetSchema);
module.exports=assetsmodel;