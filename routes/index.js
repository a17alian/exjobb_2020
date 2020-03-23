var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Map App' });
});

router.get('/leaflet', function(req, res, next) {
  res.render('leaflet', {title: 'Leaflet Map'});

});

router.get('/openlayers', function(req, res, next) {
  res.render('ol', {title: 'OpenLayers Map'});
});

module.exports = router;
