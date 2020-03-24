
$.ajax({
    url: "http://localhost:3000/data",
    type: 'GET',
    dataType: 'json', // added data type
    success: function(res) {
      toGeoJson(res);
    }
});

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
    radius: 12,
    opacity: 0.6
  });
  
  var raster = new ol.layer.Tile({
    source: new ol.source.OSM()
  });
  
  new ol.Map({
    layers: [raster, vector],
    target: 'map',
    view: new ol.View({
      center: ol.proj.fromLonLat([13.84506, 58.39118]),
      zoom: 5
    })
  });
  
 }, 200);








