var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/floods', function(req, res, next) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/test';

  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect ', err)
    } else {
      console.log('Connected!');
      var colletion = db.colletion('Floods');
      colletion.find({}).toArray(function(err, result){
        if(err){
          res.send(err);
        } else if(result.length){
          res.render('floods', {
            "floods": result
          });
        } else {
          res.send('No documents found')
        }
        db.close();

      });
    }
  });
});
module.exports = router;
