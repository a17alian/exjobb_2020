$.ajax({
    url: "http://localhost:3000/data",
    type: 'GET',
    dataType: 'json', // added data type
    success: function(res) {
       generateMarkers(res);
    }
});
// Map variables
var mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWFsaWNlZWxpbiIsImEiOiJjazdhODdkaXcwd2diM2xvZ2RkaTZ0OWRiIn0.IFaMMoDYdmhfKPabfufJhA',
    mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';


var markers = L.layerGroup();

var satellite = L.tileLayer(mapboxUrl, {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
    streets = L.tileLayer(mapboxUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
    grayscale = L.tileLayer(mapboxUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr})


function generateMarkers(floods){
    for(var i = 0; i < 100; i ++){
        marker = L.marker([floods[i].lat, floods[i].long]).bindPopup(
            '<h3> ' + floods[i].country + ' </h3>' + 
            'Main cause: ' +  floods[i].maincause + '<br>' + 
            'Dead: ' + floods[i].dead + '<br>' + 
            'Began: ' + floods[i].began + '<br>' + 
            'Ended: ' + floods[i].ended);
        markers.addLayer(marker);    
    }
}

function generateCircles(floods){
    for(var i = 0; i < 100; i ++){
        circle = L.circle([floods[i].lat, floods[i].long], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: floods[i].area
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
    center: [58.587745, 16.192420999999968],
    zoom: 3,
    layers: [grayscale, markers, satellite]
});

var baseMaps = {
    "Grayscale": grayscale,
    "Streets": streets,
    "Satellite":satellite
};

var overlayMaps = {
    "Markers": markers
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

var markerArray = [];
// Fetching saved markers in local storage
function fetchMarkers(){
    var storedMarkers = JSON.parse(localStorage.getItem("markers"));
    for(key in storedMarkers) {
        if(storedMarkers.hasOwnProperty(key)) {
            var value = storedMarkers[key];
            L.marker([value['lat'], value['lng']]).addTo(markers);
        }
    }
}

function saveMarker(newMarker){
    markerArray.push(newMarker.getLatLng());
   localStorage.setItem("markers", JSON.stringify(markerArray));
} 

function addMarker(){
    var lat = document.getElementById("latVal").value;
    var lng = document.getElementById("lngVal").value;
    map.panTo([lat, lng]);
    saveMarker(L.marker([lat, lng]).addTo(markers));
    lat = "";
    lng = "";

}
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

function clearMarkers(){
    window.localStorage.clear();
   markers.clearLayers();
   location.reload();
}
// Close window in esc press
window.onkeydown = function( event ) {
    if ( event.keyCode == 27 ) {
        showInput();
    }
};
function redirect(clicked_id){
    switch(clicked_id){
        case "floods": 
            alert(clicked_id);
            break;
        case "floods2":
            alert(clicked_id); 
            break; 
        default:
            console.log('Not an id');
            break;   
    }

}

