let array_data = JSON.parse(localStorage.getItem("scrapedData"))  || [];
let tile_data = JSON.parse(localStorage.getItem("scrapedTileData"))  || [];
var dataPoints = 2000;

// Fetching data from mongoDB with AJAX
$.ajax({
    url: "http://localhost:3000/data",
    type: 'GET',
    dataType: 'json', // added data type
    beforeSend: function(){
         // get time before GET
         let get_time = Date.now();
         localStorage.setItem("get_time", get_time);
    },success: function(res) {
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

function print_time(end_time){
    if(array_data.length < 10){   
        var stored_time = localStorage.getItem("get_time");
        var measurement = (end_time -  stored_time);

        array_data.push(Math.round(measurement));
        localStorage.setItem("scrapedData", JSON.stringify(array_data));
        
        //console.log(array_data);
        document.getElementById('data').innerHTML = array_data.join(" <br> ");
        document.getElementById('fab-btn').innerHTML = array_data.length ;

    } else{
        console.log('Data finished');
        localStorage.clear();
    }
}

function generateHeatmap(floods){
    for(var i = 0; i < floods.length; i ++){
        heatmapObj[i] = {lat: floods[i].lat, lng: floods[i].long}
        coordsData.data.push(heatmapObj[i]);
    }
    heatmapLayer.setData(coordsData);
    var end_time = Date.now();
    print_time(end_time);
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
    center: [41.015137, 28.979530],
    zoom: 4,
    layers: [heatmapLayer]
});

var tile_layer = L.tileLayer(mapboxUrl, {
    attribution: mbAttr,
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWFsaWNlZWxpbiIsImEiOiJjazdhODdkaXcwd2diM2xvZ2RkaTZ0OWRiIn0.IFaMMoDYdmhfKPabfufJhA'
}).addTo(map);

$(".leaflet-control-zoom-in").add(".leaflet-control-zoom-out").click(function() {
    var tile_start = Date.now();
    localStorage.setItem("tile_start", tile_start);
  });

tile_layer.on("load",function() { 
    if(tile_data.length < 10 && localStorage.getItem("tile_start") != null){
        var tile_end = Date.now();
        var stored_time = localStorage.getItem("tile_start");
        var completed_tile = (tile_end -  stored_time);

        tile_data.push(Math.round(completed_tile));
        localStorage.setItem("scrapedTileData", JSON.stringify(tile_data));
        
        console.log(tile_data);

        localStorage.removeItem('tile_start');
        document.getElementById('tile_data').innerHTML =  tile_data.join(" <br> ");
    } else {
        console.log('Tile Data finished');
        localStorage.removeItem('scrapedTileData');
        localStorage.removeItem('tile_start');
    }

});

var overlayMaps = {
    "Heatmap": heatmapLayer,
    "Markers": markers,
};

var popup = L.popup();
L.control.layers(overlayMaps).addTo(map);

