
$.ajax({
  url: "http://localhost:3000/data",
  type: 'GET',
  dataType: 'json', // added data type
  success: function(res) {
    generateHeatmap(res);
    generateMarkers(res);
  }
});
$("#heatmap").prop("checked", true);
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

function generateHeatmap(floods) {
  for(var i = 0; i < floods.length; i ++){
    marker[i] = {type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: ol.proj.fromLonLat([floods[i].long, floods[i].lat])}};
    geojsonObject.features.push(marker[i]);
  }
  return geojsonObject
};


var iconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    scale: 0.13,
    src: '../marker.png'
  })
});
var iconFeatures = [];

  // Marker
  var markerSource = new ol.source.Vector({});

function generateMarkers(floods) {
  for(var i = 0; i < floods.length; i ++){
    var iconFeature = new ol.Feature({geometry: new ol.geom.Point(ol.proj.fromLonLat([floods[i].long, floods[i].lat])), country: floods[i].country, cause: floods[i].maincause, dead: floods[i].dead, began: floods[i].began, ended: floods[i].ended
    });
    iconFeature.setStyle(iconStyle);
    markerSource.addFeature(iconFeature);
  } // for loop end
}
setTimeout(function(){
  // Heatmap
  var heatmapSource =  new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(geojsonObject)
  });

  var heatmapLayer = new ol.layer.Heatmap({
    source: heatmapSource,
    radius: 12,
    opacity: 0.6,
  });

  var markerLayer = new ol.layer.Vector({
    source: markerSource
  });

  var raster = new ol.layer.Tile({
    source: new ol.source.OSM(),
    crossOrigin: ''
  });
  
  var map = new ol.Map({
    layers: [raster, heatmapLayer],
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
   offset: [0, -10]
 });
 map.addOverlay(popup)

 $( "#controlls" ).click(function() {
  var clicked_id = $('input[type=radio][name=layers]:checked').attr('id');
  switch(clicked_id ){
   case 'heatmap':
       map.removeLayer(markerLayer);
       map.addLayer(heatmapLayer);
     break;
   case 'markers':
       map.removeLayer(heatmapLayer);
       map.addLayer(markerLayer);
     break; 
   default: 
     console.log('Not a id');
  }
});

// display popup on click
map.on('click', function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,
    function(feature) {
      return feature;
    });
  if (feature) {
    var coordinates = feature.getGeometry().getCoordinates();
    popup.setPosition(coordinates);
    $(element).popover({
      placement: 'top',
      html: true,
      content: '<h5>' + feature.get('country') + '</h5>' + 
      '<div> Casue: ' +  feature.get('cause') + '</div>' +
      '<div> Dead: ' + feature.get('dead') + '</div>' + 
      '<div> Began: ' + feature.get('began') + '</div>' + 
      '<div> Ended: ' + feature.get('ended') + '</div>'
    });
    $(element).popover('show');
  } else {
    $(element).popover('destroy');
  }
});


}, 300);