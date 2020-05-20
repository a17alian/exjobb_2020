let array_data = JSON.parse(localStorage.getItem("scrapedData")) || [];
let tile_data = JSON.parse(localStorage.getItem("scrapedTileData")) || [];
var dataPoints = 2413;
var floods_large = [];
var zoomOn = false;

$.ajax({
    url: "http://localhost:3000/data",
    type: 'GET',
    dataType: 'json', // added data type
    beforeSend: function () {
        // get time before GET
        let get_time = Date.now();
        localStorage.setItem("get_time", get_time);
    }, success: function (res) {
        generateMarkers(res);
        generateHeatmap(res);  
    }
});


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

function print_time(end_time) {
        var stored_time = localStorage.getItem("get_time");
        var measurement = (end_time - stored_time);

        array_data.push(Math.round(measurement));
        localStorage.setItem("scrapedData", JSON.stringify(array_data));

        document.getElementById('data').innerHTML = array_data.join(" <br> ");
        document.getElementById('fab-btn').innerHTML = array_data.length;
}

function generateHeatmap(floods) {    
        for (var j = 0; j < floods.length; j++) {
            heatmapObj[j] = { lat: floods[j].lat, lng: floods[j].long }
            coordsData.data.push(heatmapObj[j]);
        }
    
        heatmapLayer.setData(coordsData);
        var end_time = Date.now();
        print_time(end_time);
}

function generateMarkers(flood) {
    for (var j = 0; j < flood.length; j++) {
        marker = L.marker([flood[j].lat, flood[j].long]).bindPopup(
            '<h3> ' + flood[j].country + ' </h3>' +
            'Cause: ' + flood[j].maincause + '<br>' +
            'Dead: ' + flood[j].dead + '<br>' +
            'Began: ' + flood[j].began + '<br>' +
            'Ended: ' + flood[j].ended);
        markers.addLayer(marker);
    }
        var end_time = Date.now();
        print_time(end_time);
}

// Azores 37.794594, -25.506134
// Tuy Hoa 13.0954599, 109.3209381

var map = L.map('mapid', {
    center: [13.0954599, 109.3209381],
    zoom: 3,
    layers: [heatmapLayer]
});
var tile_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
}).addTo(map);
/* Code for measuring only on zoom in 
$(".leaflet-control-zoom-out").click(function () {
    zoomOn = false;
});
$(".leaflet-control-zoom-in").click(function () {
    var tile_start = Date.now();
    localStorage.setItem("tile_start", tile_start);
    zoomOn = true;
});
*/
// Code for measuring only on zoom in 
$(".leaflet-control-zoom-in").click(function () {
    zoomOn = false;
});
$(".leaflet-control-zoom-out").click(function () {
    var tile_start = Date.now();
    localStorage.setItem("tile_start", tile_start);
    zoomOn = true;
});
tile_layer.on("load", function () {
    if (localStorage.getItem("tile_start") != null && zoomOn == true) {
        var tile_end = Date.now();
        var stored_time = localStorage.getItem("tile_start");
        var completed_tile = (tile_end - stored_time);

        tile_data.push(Math.round(completed_tile));
        localStorage.setItem("scrapedTileData", JSON.stringify(tile_data));

        localStorage.removeItem('tile_start');
        document.getElementById('tile_data').innerHTML = tile_data.join(" <br> ");
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