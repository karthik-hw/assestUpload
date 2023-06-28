require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const {validPassword,genPassword}=require('./utils/utils')
const user=require('./models/user.model')
const GridFSBucket = require('mongodb').GridFSBucket;
const port=process.env.PORT||5001;
const app = express();
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// Connect to MongoDB
mongoose.connect(process.env.MongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>
{
    console.log('connected to db')
}).catch((err)=>{console.log(err)});
const conn = mongoose.connection;

let gfs;

conn.once('open', () => {
  // Initialize GridFS bucket
  const db = conn.db;
  gfs = new GridFSBucket(db, { bucketName: 'uploads' });
});

// Create storage engine using multer
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.get('/',(req,res)=>
{
    res.render('index');
})

//Signup
app.get('/signUp',(req,res)=>{
  res.render('signup',{error:null})
})

//Login
app.get('/login',(req,res)=>{
  res.render('login',{error:null})
})

app.post('/signUp',async (req,res)=>{
  try{
  if(Boolean(await user.findOne({email:req.body.email}))){
    res.render('signup',{error:"Email already registered"})
  }
  else{
 let newUser=new user({email:req.body.email,password:genPassword(req.body.password)})
 await newUser.save()
 res.redirect('/login',{error:null})
  }
}catch(err){
  console.log("err: ",err)
  res.status(500).json({status:false,message:"Server error"})
}
})

app.post('/login',async (req,res)=>{
  try{
    let userCredentials=await user.findOne({email:req.body.email})
    if(userCredentials){
      if(validPassword(req.body.password,userCredentials.password)){
        res.render('login',{error:"Invalid Password"})
      }
      else{
        res.redirect('/')
      }
    }
    else{
      res.render('login',{error:"Account not found. Please log in"})
    }

  }
  catch(err){
    console.log(err)
    res.status(500).json({status:false,message:"Server Error"})
  }
})

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  const { file } = req;

  if (!file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const { originalname, buffer } = file;

  const writestream = gfs.openUploadStream(originalname);
  writestream.write(buffer);
  writestream.end();

  writestream.on('finish', (uploadedFile) => {
    res.json({ file: uploadedFile });
  });

  writestream.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
  
    const downloadStream = gfs.openDownloadStreamByName(filename);
  
    downloadStream.on('error', (err) => {
      res.status(404).json({ error: 'File not found' });
    });
  
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.set('Content-Type', 'application/octet-stream');
  
    downloadStream.pipe(res);
  });
// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
