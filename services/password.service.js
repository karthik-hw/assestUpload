const bcrypt=require('bcrypt');
class PasswordService
{
    hashPassword(password)
    {
        return new Promise((reslove,reject)=>
        {
            bcrypt.genSalt(10, function(err, salt) {
                if(err)
                {
                    reject(err);
                }
                else
                {
                    bcrypt.hash(password, salt, function(err, hash) {
                        if(err)
                        {
                            reject(err);
                        }
                        else
                        {
                            reslove(hash);
                        }
                    });
                }
            
            });
        })
    }
    isUserPasswordValid(password,originalPassword)
        {
            return new Promise(function(reslove,reject)
            {
                bcrypt.compare(password,originalPassword)
                .then((res)=>
                {
                    console.log(res);
                    if(res)
                    {
                        reslove(true);
                    }
                    else
                    {
                        reslove(false);
                    }
                }).catch((err)=>
                {
                    reject(err);
                })
            })
    }
}
module.exports=PasswordService;