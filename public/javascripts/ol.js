
$.ajax({
    url: "http://localhost:3000/data",
    type: 'GET',
    dataType: 'json', // added data type
    success: function(res) {
        toGeoJson(res);

    }
});
var testObj = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          40.60546875,
          56.601838481314694
        ])
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          12.7001953125,
          62.08331486294795
        ])
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          7.646484374999999,
          52.482780222078226
        ])
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          21.09375,
          65.83877570688918
        ])
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          23.5546875,
          63.78248603116502
        ])
      }
    }
  ]
};
var geojsonObject = {
  type: 'FeatureCollection',
  features: []
};

var marker = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: "",
  }
};
function toGeoJson(floods) {
  for(var i = 0; i < 5; i ++){
    marker[i] = {type: 'Feature', properties: {}, geometry: {type: 'Point', coordinates: ol.proj.fromLonLat([floods[i].long, floods[i].lat]) }}
    geojsonObject.features.push(marker[i]);
  }
  return geojsonObject;
};
 console.log(geojsonObject);
 console.log(testObj);

var vectorSource = new ol.source.Vector({
  features: new ol.format.GeoJSON().readFeatures(testObj)
});

var vector = new ol.layer.Heatmap({
  source: vectorSource,
  radius: 15
});

var raster = new ol.layer.Tile({
  source: new ol.source.OSM({
    layer: 'toner'
  })
});

new ol.Map({
  layers: [raster, vector],
  target: 'map',
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});
