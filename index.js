const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoClient=require('mongodb');
const url='mongodb+srv://hima:nature@cluster0-6o34c.mongodb.net/test?retryWrites=true&w=majority';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.get('/view', function (req, res) {
    // console.log( req.header('User-Agent'))
    const ipInfo = req.ipInfo; 
    mongoClient.connect(url, (err, db) => {
        if (err) return console.log(err);
        var dbo = db.db("URL");
        var urlLink = dbo.collection('shorturldb').find().toArray();
        urlLink
            .then(function (data) {
                db.close();
                res.json(data);
            })
            .catch(function (err) {
                db.close();
                res.status(500).json({
                    message: "error"
                })
            })

    })
});

app.post('/shorturl',function(req,res){
    mongoClient.connect(url,function(err,db){
        if(err) throw err;
        // console.log(err);
        var dbo=db.db('URL');
        var obj={long:req.body.url,short:shortenURL()}
        dbo.collection('shorturldb').insertOne(obj,function(err,result){
            if(err) throw err;
            console.log('linkadded');
            db.close();
            res.json({
                message:'Link added',
                newurl: obj.short,
                oldurl: obj.long
                })
            })
        })
  
    });
function shortenURL(){
    var short='';
    var characters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var len=characters.length;
    for(var i=0;i<5;i++){
        short+=characters.charAt(Math.floor(Math.random()*len));
    }
    return "http://"+short;
}


app.listen(process.env.PORT,function(){
    
});