
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
          5.230257,
          35.814242
        ])
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          32.349078
          -25.869263
        ])
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          32.349078,
          -25.869263
        ])
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          122.97428,
          10.020719
        ])
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          43.359976,
          -11.651576
        ])
      }
    }
  ]
};
var geojsonObject = {
  "type": "FeatureCollection",
  "features": []
};

var marker = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": "",
  }
};

function toGeoJson(floods) {
  for(var i = 0; i < floods.length; i ++){
    marker[i] = {type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: ol.proj.fromLonLat([floods[i].long, floods[i].lat])}};
    geojsonObject.features.push(marker[i]);
  }
  return geojsonObject
};

setTimeout(function(){
  var vectorSource =  new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(geojsonObject)
  });
  var vector = new ol.layer.Heatmap({
    source: vectorSource,
    opacity: 0.5,
    weight: 0.2

  });
  
  var raster = new ol.layer.Tile({
    source: new ol.source.OSM()
  });
  
  new ol.Map({
    layers: [raster, vector],
    target: 'map',
    view: new ol.View({
      center: ol.proj.fromLonLat([58.39118, 13.84506]),
      zoom: 3
    })
  });
  
 }, 200);








