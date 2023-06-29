const express=require('express');
const router=express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const passport=require('passport');
const filecontroller=require('../controller/FileHandle.controller');
router.get('/upload',passport.authenticate('jwt',{session:false}),filecontroller.prototype.upload)
router.post('/upload',passport.authenticate('jwt',{session:false}),upload.single('file'),filecontroller.prototype.upload);
router.get('/download/:filename',filecontroller.prototype.download);
module.exports=router;