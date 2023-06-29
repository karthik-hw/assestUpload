const {db1:conn}=require('../config/mongoSetup');
const GridFSBucket = require('mongodb').GridFSBucket;
const AssestModel=require('../models/assets.model');
const Assest=require('../schema/Assest');
const {ObjectId } = require('mongodb');
let gfs;
conn.once('open', () => {
    // Initialize GridFS bucket
    const db = conn.db;
    gfs = new GridFSBucket(db, { bucketName: 'uploads' });
  });
class FileHandle
{
    async upload(req,res)
    {
        try 
        {
            if(req.method==='GET')
            {
                const assests=await AssestModel.find({});
                console.log(req.user);
                return res.render('index',{assests:assests,name:req.user.name});
            }
            const { file } = req;
            if (!file) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }
            const { originalname, buffer } = file;
            const isExist=await AssestModel.findOne({fileName:originalname});
            if(isExist)
            {
                return res.send(`
                     <h1>File already exit</h1>
                     <a href='/files/upload'> try agian</a>
                `)
            }
            else
            {
                const writestream = gfs.openUploadStream(originalname);
                writestream.write(buffer);
                writestream.end();
    
                writestream.on('finish', async (uploadedFile) => 
                {
                    const newAssest=new Assest(uploadedFile.filename,req.body.projectname,req.user.name,uploadedFile._id);
                    const assest=await AssestModel.create(newAssest);
                    await assest.save();
                    res.redirect('/files/upload');
                });
    
                writestream.on('error', (err) => {
                    res.status(500).json({ error: err.message });
                });
            }
        } 
        catch (error) 
        {
            console.log(error)
            res.status(500).send('internal server error');
        }
    }
    download(req,res){
        try 
        {
            const filename = req.params.filename;
  
            const downloadStream = gfs.openDownloadStreamByName(filename);
          
            downloadStream.on('error', (err) => {
              res.status(404).json({ error: 'File not found' });
            });
          
            res.set('Content-Disposition', `attachment; filename="${filename}"`);
            res.set('Content-Type', 'application/octet-stream');
          
            downloadStream.pipe(res);
        } 
        catch (error) 
        {
            res.status(500).send('internal server error');
        }
    }
    async removeFile(req,res){
        try {
            const {id}=req.params;
            console.log(!id);
            if(!id)
            {
         
                return res.status(404).json({ error: 'File not found' });
            }
            await gfs.delete(new ObjectId(id));
            await AssestModel.deleteOne({fileid:id});
            res.send("deleted succssfully")
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to find file' });
        }
    }
}
module.exports=FileHandle;