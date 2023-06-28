const bcrypt=require('bcrypt')
function validPassword(password,hash) {
    return bcrypt.compareSync(password,hash);
}

function genPassword(password) {
    let hash=bcrypt.hashSync(password,parseInt(process.env.SALT_ROUNDS))
    return hash
    
}
module.exports.validPassword=validPassword;
module.exports.genPassword=genPassword;