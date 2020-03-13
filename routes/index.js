var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Map App' });
});

router.get('/leaflet', function(req, res, next) {
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/test';
    
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("test");
      //Find all in the floods collection:
      dbo.collection("floods").find({}).toArray(function (err, result) {
        if (err) {
          res.send(err);
        } else if (result.length) {
          res.render('leaflet',{
            // Pass the returned database documents to Jade
            floods : result
          });
        } else {
          res.send('No documents found');
        }
        //Close connection
        db.close();
      });
    });

});

router.get('/openlayers', function(req, res, next) {
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/test';
    
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("test");
      //Find all in the floods collection:
      dbo.collection("floods").find({}).toArray(function (err, result) {
        if (err) {
          res.send(err);
        } else if (result.length) {
          res.render('ol',{
            // Pass the returned database documents to Jade
            floods : result
          });
        } else {
          res.send('No documents found');
        }
        //Close connection
        db.close();
      });
    });

});

module.exports = router;
