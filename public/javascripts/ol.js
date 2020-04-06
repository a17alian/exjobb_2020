
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

var iconFeature = new ol.Feature({
  geometry: new ol.geom.Point([0, 0]),
  name: 'Null Island',
  population: 4000,
  rainfall: 500
});

var iconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'data/icon.png'
  })
});
setTimeout(function(){
  var vectorSource =  new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(geojsonObject)
  });
   vector = new ol.layer.Heatmap({
    source: vectorSource,
    radius: 12,
    opacity: 0.6,

  });
  
  iconFeature.setStyle(iconStyle);

  var markerSource = new ol.source.Vector({
    features: [iconFeature]
  });
  
  var markerLayer = new ol.layer.Vector({
    source: markerSource
  });
  

  var raster = new ol.layer.Tile({
    source: new ol.source.OSM()
  });
  
  var map = new ol.Map({
    layers: [raster, markerLayer],
    target: 'map',
    view: new ol.View({
      center: ol.proj.fromLonLat([13.404954, 52.520008]),
      zoom: 5
    })
  });

  var element = document.getElementById('popup');

 var popup = new ol.Overlay({
   element: element,
   positioning: 'bottom-center',
   stopEvent: false,
   offset: [0, -50]
 });
 map.addOverlay(popup);
   
 }, 200);

 $( "#controlls" ).click(function() {
  switch($('input[type=radio][name=layers]:checked').attr('id')){
   case 'heatmap':
     map.setLayerGroup(vector);
     break;
   case 'markers':
     break; 
     map.setLayerGroup(layersMQ);
   default: 
     console.log('Not a id');
  }

});
