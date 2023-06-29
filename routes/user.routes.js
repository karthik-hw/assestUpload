const express=require('express');
const router=express.Router();
const authController=require('../controller/auth.controller');
router.get('/login',authController.prototype.Login);
router.post('/login',authController.prototype.Login);
router.get('/signup',authController.prototype.SignUp);
router.post('/signup',authController.prototype.SignUp);
module.exports=router;