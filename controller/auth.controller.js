const UserModel=require('../models/user.model');
const User=require('../schema/User');
const AuthMiddleware = require('../services/auth.service');
const PasswordService=require('../services/password.service');

class Auth
{
    async Login(req,res){
        try {
            if(req.method==='GET')
            {
                res.render('login');
            }
            else
            {
                const {email,password}=req.body;
                const User=await UserModel.findOne({email:email});
                if(!User)
                {
                    return res.status(404).send("invalid credentials");
                }
                console.log(password)
                const isUserPasswordValid=await PasswordService.prototype.isUserPasswordValid(password,User.password);
                console.log(isUserPasswordValid)
                if(!isUserPasswordValid)
                {
                    return res.status(404).send("invalid credentials");
                }
                const token=await AuthMiddleware.prototype.jwtToken(User._id,User.email);
                res.cookie("w-access-token",token,{httpOnly:true});
                return res.redirect('/files/upload');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("<a href='/login'>try agian</>")
        }
    }
    async SignUp(req,res){
        try {
            if(req.method==='GET')
            {
                res.render('signup');
            }
            else
            {
                const isUserExist=await UserModel.find({ $or: [{ email:req.body.email }, { name:req.body.name }] });
                if(isUserExist.length)
                {
                    res.send("Account already exist because the email or name");
                }
                else
                {
                    const {email,password,phone,name}=req.body
                    const newUser=new User(name,email,password,phone);
                    newUser.password=await PasswordService.prototype.hashPassword(newUser.password);
                    const user=await UserModel.create(newUser);
                    await user.save();
                    res.redirect('/login');
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).send("<a href='/signup'>try agian</>")
        }
    }
}
module.exports=Auth;