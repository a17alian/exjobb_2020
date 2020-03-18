$.ajax({
    url: "http://localhost:3000/data",
    type: 'GET',
    dataType: 'json', // added data type
    success: function(res) {
        toGeoJson(res);

    }
});
function generateMarkers(floods){
  for(var i = 0; i < 100; i ++){
    heatmapObj[i] = {lat: floods[i].lat, lng: floods[i].long}
    coordsData.data.push(heatmapObj[i]);
}

}
var geojsonObject = {
  type: 'FeatureCollection',
  features: []
};
var marker = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: []
  }
};
function toGeoJson(floods) {


  for(var i = 0; i < 100; i ++){
    marker.coordinates =  floods[i].lat , floods[i].long;

    geojsonObject.features.push(marker[i]);
  }
  console.log( geojsonObject.features);
  return geojsonObject;
};
console.log(geojsonObject);
// Create a heatmap layer based on GeoJSON content
var heatmapLayer = new ol.layer.Heatmap({
  source: new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
  }),
  opacity: 0.9
});

// Create a tile layer from OSM
var osmLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

// Create the map with the previous layers
var map = new ol.Map({
  target: 'map',  // The DOM element that will contains the map
  renderer: 'canvas', // Force the renderer to be used
  layers: [osmLayer, heatmapLayer],
  // Create a view centered on the specified location and zoom level
  view: new ol.View({
      center: ol.proj.transform([2.1833, 41.3833], 'EPSG:4326', 'EPSG:3857'),
      zoom: 4
  })
});
