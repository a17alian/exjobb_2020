var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

/* GET data listing. */
router.get('/', function(req, res, next) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/test';
    
  MongoClient.connect(url,{useUnifiedTopology: true,useNewUrlParser: true,}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("test");
      //Find all in the floods collection:
      dbo.collection("floods_small").find({}).toArray(function (err, result) {
        if(err){
          res.send(err);
        } else {
          res.json(result);
        }
        //Close connection
        db.close();
      });
    });
});

module.exports = router;
