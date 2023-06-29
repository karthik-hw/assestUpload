require('dotenv').config();
const express = require('express');
const port=process.env.PORT||5001;
const app = express();
const passport=require('passport');
const cookieParser=require('cookie-parser');
const methodOverride = require('method-override');
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(passport.initialize());

app.get('/',(req,res)=>
{
    res.render('login');
})
require('./config/passportSetup')(passport);
app.use('/files',require('./routes/files.routes'));
app.use('/',require('./routes/user.routes'));
// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});