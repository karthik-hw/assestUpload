const express=require('express');
const router=express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const filecontroller=require('../controller/FileHandle.controller');
router.post('/upload',upload.single('file'),filecontroller.prototype.upload);
router.get('/download/:filename',filecontroller.prototype.download);
module.exports=router;