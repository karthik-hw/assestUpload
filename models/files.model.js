const mongoose=require('mongoose')
const Schema=mongoose.Schema
const filesSchema=new Schema({
    filename:{type:String,required:true},
    projectname:{type:String,required:true}
})
const files=mongoose.model('files',filesSchema)
module.exports=files