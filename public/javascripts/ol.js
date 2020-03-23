
$.ajax({
    url: "http://localhost:3000/data",
    type: 'GET',
    dataType: 'json', // added data type
    success: function(res) {
        toGeoJson(res);

    }
});

var testObj = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          40.60546875,
          56.601838481314694
        ])
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          12.7001953125,
          62.08331486294795
        ])
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          7.646484374999999,
          52.482780222078226
        ])
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          21.09375,
          65.83877570688918
        ])
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": ol.proj.fromLonLat([
          23.5546875,
          63.78248603116502
        ])
      }
    }
  ]
};
var geojsonObject = {
  type: 'FeatureCollection',
  features: []
};

var marker = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: "",
  }
};
function toGeoJson(floods) {
  for(var i = 0; i < 5; i ++){
    marker[i] = {type: 'Feature', properties: {}, geometry: {type: 'Point', coordinates: ol.proj.fromLonLat([floods[i].long, floods[i].lat]) }}
    geojsonObject.features.push(marker[i]);
  }
  return geojsonObject;
};
 console.log(geojsonObject);
 console.log(testObj);
/*
var vectorSource = new ol.source.Vector({
  features: new ol.format.GeoJSON().readFeatures(geojsonObject,{
    featureProjection: 'EPSG:3857'
})
});

var vector = new ol.layer.Heatmap({
  source: vectorSource,
  blur: 10,
  radius: 10
});

var raster = new ol.layer.Tile({
  source: new ol.source.OSM({
    layer: 'toner'
  })
});

new ol.Map({
  layers: [raster, vector],
  target: 'map',
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});
*/
/*Create a heatmap layer based on GeoJSON content
     var heatmapLayer = new ol.layer.Heatmap({
      source: new ol.source.Vector({
        url: '../map.geojson',
        projection: 'EPSG:3857',
        format: new ol.format.GeoJSON({extractStyles: false})
      }),
      opacity: 0.95,
      blur: 10,
      radius: 15
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
          center: [58.39118, 13.84506],
          zoom: 3
      })
  });


  map.on('pointermove', function(evt) {
    if (evt.dragging) {
    }
  });
  */



  // Map
var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
  ],
  target: 'map',
  view: new ol.View({
    center: ol.proj.transform([58.39118, 13.84506], 'EPSG:4326', 'EPSG:3857'),
    zoom: 2
  })
});
var vectorSource = new ol.source.Vector({
  features: (new ol.format.GeoJSON()).readFeatures(testObj),
  projection: 'EPSG:3857'
});


// create the layer
heatMapLayer = new ol.layer.Heatmap({
   source: vectorSource,
   radius: 15
});

// add to the map
map.addLayer(heatMapLayer);