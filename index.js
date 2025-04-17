const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoClient = require('mongodb');
const url='mongodb+srv://personalprojecthima:anq1CKPEFKLGXAx2@cluster0.1sknmnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


// function to shorten url
function shortenURL() {
    var short = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var len = characters.length;
    for (var i = 0; i < 5; i++) {
        short += characters.charAt(Math.floor(Math.random() * len));
    }
    return short;
}

//post url
app.post('/shorturl', function (req, res) {
  
    
    mongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        // console.log(err);
        var dbo = db.db('URLS');
        var short = shortenURL();
        dbo.collection('shorturl').findOne({ "long": req.body.url }, function (err, result) {
            if (err) throw err;
            if (result) {
                res.json({
                    status:409,
                    message: "duplicate url"
                })
            } else {

                var obj = { "long": req.body.url, "short": short, clicks: 0 }
                dbo.collection('shorturl').insertOne(obj, function (err, result) {
                    if (err) throw err;
                 
                    db.close();
                    res.json({
                        status: 200,
                        message: 'Link added'
                    });

                });

            }

        });
    })

});

//getting all urls 
app.get('/home', function (req, res) {
    // console.log( req.header('User-Agent'))
    const ipInfo = req.ipInfo;
    mongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
        if (err) return console.log(err);
        var dbo = db.db("URLS");
        var urlLink = dbo.collection('shorturl').find().toArray();
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

//deleting urls 
app.delete("/delete/:id", function (req, res) {
    let id = req.params.id;
    // console.log('inside delete' + id);
    var ObjectId = require('mongodb').ObjectID;
    mongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        if (err) throw err;
        var db = client.db("URLS");
        // console.log(id);
        db.collection("shorturl").deleteOne({ _id: ObjectId(id) }, function (err, result) {
            if (err) throw err;
            client.close();
            if (result.deletedCount == 1) {
                res.json({
                    status: 200,
                    message: "deleted"
                })
            }
            else {
                res.json({

                    message: "Error"
                })
            }

        });
    });
});

//redirection 
app.get('redirect/:shorturlid', cors(),function(req,res){
    var url_new=req.params.shorturlid
   
    mongoClient.connect(url, { useUnifiedTopology: true } , (err, client) => {
        if (err) return console.log(err);
        var db = client.db("URLS");
        db.collection('shorturl').findOne({short:url_new},function(err,data){
            if (err) throw err;
            db.collection('shorturl').findOneAndUpdate({ short: url_new}, { $inc: { clicks: +1 } }, function (err, data) {
                if (err) throw err;
                
                client.close();
                if (data.value) {
                    const longUrl = data.value.long;
                    res.redirect(longUrl);
                } else {
                    res.status(404).send("Short URL not found.");
                }
                

            })
        })

    })

})

const PORT = process.env.PORT || 8080;

app.listen(8080, () => {
    console.log("Server is running");
  });