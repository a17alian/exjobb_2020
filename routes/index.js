var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Map App' });
});

/* GET Leaflet page. */
router.get('/leaflet', function(req, res, next) {
  res.render('leaflet', {title: 'Leaflet Map'});

});

/* GET OpenLayers page. */
router.get('/openlayers', function(req, res, next) {
  res.render('ol', {title: 'OpenLayers Map'});
});

module.exports = router;
