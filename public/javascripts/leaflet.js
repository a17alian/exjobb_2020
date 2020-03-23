// Fetching data from mongoDB with AJAX
$.ajax({
    url: "http://localhost:3000/data",
    type: 'GET',
    dataType: 'json', // added data type
    success: function(res) {
       generateHeatmap(res);
       generateMarkers(res);
    }
});
// Map variables
var mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWFsaWNlZWxpbiIsImEiOiJjazdhODdkaXcwd2diM2xvZ2RkaTZ0OWRiIn0.IFaMMoDYdmhfKPabfufJhA',
    mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

var markers = L.layerGroup();
var coordsData = {
    max: 8,
    data: []
};  

var satellite = L.tileLayer(mapboxUrl, {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
    streets = L.tileLayer(mapboxUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
    grayscale = L.tileLayer(mapboxUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr})

heatmapObj = {};

 var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 15,
    "maxOpacity": .5, 
    // scales the radius based on map zoom
    "scaleRadius": false, 
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries 
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": true,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count',
    blur: 0.95
  };
  
var heatmapLayer = new HeatmapOverlay(cfg);   

function generateHeatmap(floods){
    for(var i = 0; i < floods.length; i ++){
        heatmapObj[i] = {lat: floods[i].lat, lng: floods[i].long}
        coordsData.data.push(heatmapObj[i]);
    }
    heatmapLayer.setData(coordsData);
}
function generateMarkers(floods){
    for(var i = 0; i < floods.length; i ++){
        marker = L.marker([floods[i].lat, floods[i].long]).bindPopup(
            '<h3> ' + floods[i].country + ' </h3>' + 
            'Cause: ' +  floods[i].maincause + '<br>' + 
            'Dead: ' + floods[i].dead + '<br>' + 
            'Began: ' + floods[i].began + '<br>' + 
            'Ended: ' + floods[i].ended);
        markers.addLayer(marker);    
    }
}
function generateCircles(floods){
    for(var i = 0; i < floods.length; i ++){
        circle = L.circle([floods[i].lat, floods[i].long], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 15
        }).bindPopup(
            '<h3> ' + floods[i].country + ' </h3>' + 
            'Main cause: ' +  floods[i].maincause + '<br>' + 
            'Dead: ' + floods[i].dead + '<br>' + 
            'Began: ' + floods[i].began + '<br>' + 
            'Ended: ' + floods[i].ended);
        markers.addLayer(circle);    
    }
}

var map = L.map('mapid', {
    center: [58.39118, 13.84506],
    zoom: 3,
    layers: [streets]
});


var baseMaps = {
    "Streets": streets,
    "Grayscale": grayscale,
    "Satellite":satellite,
    "Heatmap": heatmapLayer,
};

var overlayMaps = {
    "Markers": markers,
};
var popup = L.popup();

var drawMap = function(){
    L.tileLayer(mapboxUrl, {
        attribution: mbAttr,
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYWFsaWNlZWxpbiIsImEiOiJjazdhODdkaXcwd2diM2xvZ2RkaTZ0OWRiIn0.IFaMMoDYdmhfKPabfufJhA'
    
    }).addTo(map);

    L.control.layers(baseMaps, overlayMaps).addTo(map);
}

function onMapClick(e) {
    if(document.getElementById("fab-input").style.display == 'block'){
        popup
        .setLatLng(e.latlng)
        .setContent("Clicked coordinates: " + e.latlng.lat + ", " + e.latlng.lng)
        .openOn(map);
        document.getElementById("latVal").value = e.latlng.lat;
        document.getElementById("lngVal").value = e.latlng.lng;
    
    } else {
        console.log('Cannot click map now');
    }
}
    
map.on('click', onMapClick);

drawMap();

function panMap(){
    var lat = document.getElementById("latVal").value;
    var lng = document.getElementById("lngVal").value;
    map.panTo([lat, lng]);  
}

function showInput(){
    var x = document.getElementById("fab-input");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}


// Close window in esc press
window.onkeydown = function( event ) {
    if ( event.keyCode == 27 ) {
        showInput();
    }
};

