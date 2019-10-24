// Selectable backgrounds of our map - tile layers:

// boring backgrounds.
var graymap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +"access_token=pk.eyJ1IjoidGRpbWFyZTE2IiwiYSI6ImNrMDdjM3RjcjA2dTkzbm1qYnMxOHM2cDkifQ.8jD-yx9Xr4X2svX5AUE-sQ");
var streets_background = L.tileLayer("http://a.tiles.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGRpbWFyZTE2IiwiYSI6ImNrMDdjM3RjcjA2dTkzbm1qYnMxOHM2cDkifQ.8jD-yx9Xr4X2svX5AUE-sQ#9.6/27.208808/86.342027/0");
var outdoors_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGRpbWFyZTE2IiwiYSI6ImNrMDdjM3RjcjA2dTkzbm1qYnMxOHM2cDkifQ.8jD-yx9Xr4X2svX5AUE-sQ");
var dark_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGRpbWFyZTE2IiwiYSI6ImNrMDdjM3RjcjA2dTkzbm1qYnMxOHM2cDkifQ.8jD-yx9Xr4X2svX5AUE-sQ");
var satellite_street_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGRpbWFyZTE2IiwiYSI6ImNrMDdjM3RjcjA2dTkzbm1qYnMxOHM2cDkifQ.8jD-yx9Xr4X2svX5AUE-sQ");

// Fun backgrounds.
var pencil_background = L.tileLayer("http://a.tiles.mapbox.com/v4/mapbox.pirates/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGRpbWFyZTE2IiwiYSI6ImNrMDdjM3RjcjA2dTkzbm1qYnMxOHM2cDkifQ.8jD-yx9Xr4X2svX5AUE-sQ");
var comic_background = L.tileLayer("http://a.tiles.mapbox.com/v4/mapbox.comic/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGRpbWFyZTE2IiwiYSI6ImNrMDdjM3RjcjA2dTkzbm1qYnMxOHM2cDkifQ.8jD-yx9Xr4X2svX5AUE-sQ");
var emerald_background = L.tileLayer("http://a.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGRpbWFyZTE2IiwiYSI6ImNrMDdjM3RjcjA2dTkzbm1qYnMxOHM2cDkifQ.8jD-yx9Xr4X2svX5AUE-sQ");
// var highcontrast_background = L.tileLayer("http://a.tiles.mapbox.com/v4/mapbox.high-contrast/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGRpbWFyZTE2IiwiYSI6ImNrMDdjM3RjcjA2dTkzbm1qYnMxOHM2cDkifQ.8jD-yx9Xr4X2svX5AUE-sQ");

// map object to an array of layers we created.
var map = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [dark_background, graymap_background, streets_background,
    outdoors_background, satellite_street_background, pencil_background,
    comic_background, emerald_background, highcontrast_background]
});

// adding one 'graymap' tile layer to the map.
graymap_background.addTo(map);

// layers for two different sets of data, earthquakes and tectonicplates.
var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

// base layers
var baseMaps = {
  Dark: dark_background,
  Streets: streets_background,
  Grayscale: graymap_background,
  Outdoors: outdoors_background,
  SatelliteStreets: satellite_street_background,
  Pencil: pencil_background,
  Comic: comic_background,
  Emerald: emerald_background,
  HighContrast: highcontrast_background



};

// overlays
var overlayMaps = {
  "Tectonic Plates": tectonicplates,
  "Earthquakes": earthquakes
};

// control which layers are visible.
L
  .control
  .layers(baseMaps, overlayMaps)
  .addTo(map);

// retrieve earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data) {


  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Define the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#ea2c2c";
      case magnitude > 4:
        return "#ea822c";
      case magnitude > 3:
        return "#ee9c00";
      case magnitude > 2:
        return "#eecc00";
      case magnitude > 1:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }

  // define the radius of the earthquake marker based on its magnitude.

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 3;
  }

  // add GeoJSON layer to the map
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);

  earthquakes.addTo(map);


  var legend = L.control({
    position: "bottomright"
  });


  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];


    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };


  legend.addTo(map);

  // retrive Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {

      L.geoJson(platedata, {
        color: "green",
        weight: 3
      })
      .addTo(tectonicplates);

      // add the tectonicplates layer to the map.
      tectonicplates.addTo(map);
    });
});
