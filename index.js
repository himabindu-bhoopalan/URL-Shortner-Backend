const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoClient = require('mongodb');
const url='mongodb+srv://hima:nature@cluster0-6o34c.mongodb.net/test?retryWrites=true&w=majority';
// const url = 'mongodb://localhost:27017';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


//redirection 
app.get('/:shorturlid', cors(),function(req,res){
    var url_new=req.params.shorturlid
    console.log(req.params.shorturlid,url_new);
    mongoClient.connect(url, { useUnifiedTopology: true } , (err, client) => {
        if (err) return console.log(err);
        var db = client.db("URL");
        db.collection('shorturldb').findOne({short:url_new},function(err,data){
            if (err) throw err;
            db.collection('shorturldb').findOneAndUpdate({ short: url_new}, { $inc: { clicks: +1 } }, function (err, data) {
                if (err) throw err;
                client.close();
                res.redirect(data.value.long);

            })
        })

    })

})

//getting all urls 
app.get('/', function (req, res) {
    // console.log( req.header('User-Agent'))
    console.log('form component');
    const ipInfo = req.ipInfo;
    mongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
        if (err) return console.log(err);
        var dbo = db.db("URL");
        var urlLink = dbo.collection('shorturldb').find().toArray();
        urlLink
            .then(function (data) {
                db.close();
                console.log(data);
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


//function to shorten url
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
    console.log('post method');
    console.log(req.body);
    mongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        // console.log(err);
        var dbo = db.db('URL');
        var short = shortenURL();
        dbo.collection('shorturldb').findOne({ "long": req.body.url }, function (err, result) {
            if (err) throw err;
            if (result) {
                res.json({
                    status:409,
                    message: "duplicate url"
                })
            } else {

                var obj = { "long": req.body.url, "short": short, clicks: 0 }
                dbo.collection('shorturldb').insertOne(obj, function (err, result) {
                    if (err) throw err;
                    console.log('linkadded');
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




//deleting urls 
app.delete("/delete/:id", function (req, res) {
    let id = req.params.id;
    console.log('inside delete' + id);
    var ObjectId = require('mongodb').ObjectID;
    mongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        if (err) throw err;
        var db = client.db("URL");
        // console.log(id);
        db.collection("shorturldb").deleteOne({ _id: ObjectId(id) }, function (err, result) {
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





app.listen(process.env.PORT,function(){
    console.log('The port is running');
});

