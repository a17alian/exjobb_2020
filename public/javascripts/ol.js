$.ajax({
  url: "http://localhost:3000/data",
  type: 'GET',
  dataType: 'json', // added data type
  success: function(res) {
    generateMarkers(res);
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


var iconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    scale: 0.15,
    src: '../avo.png'
  })
});
var iconFeatures = [];

function generateMarkers(floods) {
  for(var i = 0; i < 100; i ++){
    var iconFeature = new ol.Feature({geometry: new ol.geom.Point(ol.proj.fromLonLat([floods[i].long, floods[i].lat])), country: floods[i].country, cause: floods[i].maincause, dead: floods[i].dead, began: floods[i].began, ended: floods[i].ended
    });
    iconFeature.setStyle(iconStyle);
    markerSource.addFeature(iconFeature);
  } // for loop end
}
  // Heatmap
  var heatmapSource =  new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(geojsonObject)
  });
  var heatmapLayer = new ol.layer.Heatmap({
    source: heatmapSource,
    radius: 12,
    opacity: 0.6,

  });

  // Marker
  var markerSource = new ol.source.Vector({});

  var markerLayer = new ol.layer.Vector({
    source: markerSource
  });

  var raster = new ol.layer.Tile({
    source: new ol.source.OSM(),
    crossOrigin: ''
  });
  
  var map = new ol.Map({
    layers: [raster , markerLayer],
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
       console.log(clicked_id);
     break;
   case 'markers':
       console.log(clicked_id);
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
      content: '<span> Country: ' + feature.get('country') + '</span>', 
    });
    $(element).popover('show');
  } else {
    $(element).popover('destroy');
  }
});


