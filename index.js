require('dotenv').config();
const express = require('express');
const port=process.env.PORT||5001;
const app = express();
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.get('/',(req,res)=>
{
    res.render('index');
})
app.use('/files',require('./routes/files.routes'));
app.use('/',require('./routes/user.routes'));
// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});