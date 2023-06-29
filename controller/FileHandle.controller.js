const {db1:conn}=require('../config/mongoSetup')
const GridFSBucket = require('mongodb').GridFSBucket;
let gfs;
conn.once('open', () => {
    // Initialize GridFS bucket
    const db = conn.db;
    gfs = new GridFSBucket(db, { bucketName: 'uploads' });
  });
class FileHandle
{
    upload(req,res)
    {
        try 
        {
            if(req.method==='GET')
            {
                return res.render('index');
            }
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
        } 
        catch (error) 
        {
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
}
module.exports=FileHandle;