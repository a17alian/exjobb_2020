
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
  geometry: new ol.geom.Point(ol.proj.fromLonLat([15.037866699999995, 59.51920639999999])),
  name: 'Null Island',
  population: 4000,
  rainfall: 500
});

var iconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: '../avo.png'
  })
});
setTimeout(function(){
  // Heatmap
  var vectorSource =  new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(geojsonObject)
  });
  var vector = new ol.layer.Heatmap({
    source: vectorSource,
    radius: 12,
    opacity: 0.6,

  });
  // Marker
  var markerSource = new ol.source.Vector({
    features: [iconFeature]
  });

  var markerLayer = new ol.layer.Vector({
    source: markerSource
  });
 
  iconFeature.setStyle(iconStyle);


  var raster = new ol.layer.Tile({
    source: new ol.source.OSM()
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
   offset: [0, -50]
 });
 map.addOverlay(popup);

 

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
      content: feature.get('name')
    });
    $(element).popover('show');
  } else {
    $(element).popover('destroy');
  }
});


 }, 200);
