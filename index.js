require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFSBucket = require('mongodb').GridFSBucket;
const port=process.env.PORT||5001;
const MongoConnection=require('./config/mongoSetup');
const app = express();
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// Connect to MongoDB
const dbConnection1=new MongoConnection(process.env.MongoDBUri_1,1);
const conn=dbConnection1.connect();
const dbConnection2=new MongoConnection(process.env.MongoDBUri_2,2);
dbConnection2.connect()
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
module.exports={conn};