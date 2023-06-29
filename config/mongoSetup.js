const mongoose=require('mongoose');
class MongooseConnection
{
    constructor(dbUrl,dbNumber)
    {
        this.dbUrl=dbUrl;
        this.dbNumber=dbNumber
    }
    connect()
    {
        try 
        {
           const connection= mongoose.createConnection(this.dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true });
           console.log('db is connected '+this.dbNumber);
          return connection;   
        } 
        catch (error) 
        {
            console.log(`Error to connecting to db ${this.dbNumber}`)
        }
    }
}
module.exports=MongooseConnection;