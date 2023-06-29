const JwtStrategy=require('passport-jwt').Strategy;
const cookieExtractor = function (req) {
    let token = req.cookies['w-access-token'];
    return token;
};
const User=require('../models/user.model');
module.exports=(passport)=>
{
    const verifyCallback=async (jwt_payload,done)=>
    {
        try
        {
            const user=await User.findById(jwt_payload.id);
            if(!user)
            {
                return done(null,false);
            }
            else
            {
                return done(null,user);
            }
        }
        catch(err)
        {
            return done(err,null);
        }
    };
    const opts={};
    opts.jwtFromRequest=cookieExtractor;
    opts.secretOrKey=process.env.JWT_SECRET;
    const jwtstrategy=new JwtStrategy(opts,verifyCallback);
    passport.use(jwtstrategy);
}
