var render_data = JSON.parse(localStorage.getItem("scrapedData"))  || [];
var zoom_data = JSON.parse(localStorage.getItem("scrapedZoomData"))  || [];
var timeout = 300;
var zoomOn = false;
var dataPoints = 2000;

$.ajax({
  url: "http://localhost:3000/data",
  type: 'GET',
  dataType: 'json', // added data type
  beforeSend: function(){
    // get time before GET
    let render_start = Date.now();
    localStorage.setItem("render_start", render_start);
},
  success: function(res) {
    generateHeatmap(res);
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
function print_time(end_time){
  if(render_data.length < 10){   
      var stored_time = localStorage.getItem("render_start");
      var render_complete = (end_time -  stored_time) - timeout;

      render_data.push(Math.round(render_complete));
      localStorage.setItem("scrapedData", JSON.stringify(render_data));
      
      //console.log(array_data);
      document.getElementById('data').innerHTML = render_data.join(" <br> ");
      document.getElementById('fab-btn').innerHTML = render_data.length ;

  } else{
      console.log('Data finished');
      localStorage.clear();
  }
}
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
    scale: 0.5,
    src: '../leaflet_icon.png'
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
    layers: [ raster, heatmapLayer ],
    target: 'map',
    view: new ol.View({
      center: ol.proj.fromLonLat([28.979530 ,41.015137 ]),
      zoom: 4
    })
  });
// Initial render
map.once('rendercomplete', function() {
  console.log('render');
  var render_end = Date.now();
  print_time(render_end);
  
});
function zoom_time(on){
  map.once('rendercomplete', function() {
    console.log(zoomOn);
  if(on == true && zoom_data.length < 10  && localStorage.getItem("render_start") != null && render_data.length == 10){
    var zoom_end = Date.now();
    var stored_time = localStorage.getItem("zoom_start");
    var completed_zoom = (zoom_end -  stored_time);

    zoom_data.push(Math.round(completed_zoom));
    localStorage.setItem("scrapedZoomData", JSON.stringify(zoom_data));
    
    console.log(zoom_data);

    localStorage.removeItem('zoom_start');        
    document.getElementById('zoom_data').innerHTML =  zoom_data.join(" <br> ");
} else {
    console.log('Zoom Data Not Measured');
    localStorage.removeItem('scrapedZoomData');
    localStorage.removeItem('zoom_start');
  }
});
}

$(".ol-zoom-in").add(".ol-zoom-out").click(function() {
  console.log(zoomOn);
  var zoom_start = Date.now();
  localStorage.setItem("zoom_start", zoom_start);
  zoomOn = true;
  console.log(zoomOn);
});

map.on('moveend', function(){  
    zoom_time(zoomOn);
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
      if($('input[type=radio][name=layers]:checked').attr('id') == 'markers'){
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
      }
    } else {
      $(element).popover('destroy');
    }
  

});
}, timeout);