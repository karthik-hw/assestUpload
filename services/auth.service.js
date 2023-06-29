const jwt = require("jsonwebtoken");
class AuthMiddleware
{

    jwtToken(id,email)
    {
        return new Promise(function(reslove,reject)
        {
            try 
            {
                const payload={id:id,email:email};
           
                jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:3600},
                (err,token)=>
                {
                    if(err)
                    {
                        reject(err);
                    }
                    else
                    {
                        reslove(token);
                    }
                })
            } 
            catch (error) 
            {
                reject(error)
            }
        })
    }
}
module.exports=AuthMiddleware;
