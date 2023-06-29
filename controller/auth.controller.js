class Auth
{
    async Login(req,res){
        try {
            res.render('login');
        } catch (error) {
            res.status(500).send("<a href='/login'>try agian</>")
        }
    }
    async SignUp(req,res){
        try {
            res.render('signup')
        } catch (error) {
            res.status(500).send("<a href='/signup'>try agian</>")
        }
    }
    
}
module.exports=Auth;