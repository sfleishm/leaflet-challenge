var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Map Stuff 
var map = L.map("map", {
    center: [40, -100],
    zoom: 5
});

var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});//.addTo(map);

var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});//.addTo(map);

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
}).addTo(map);

var baseMaps = {
    Satellite: satellite,
    Light: light,
    Dark: dark
};

L.control.layers(baseMaps).addTo(map);


// D3 + Leaflet + GeoJson stuff
d3.json(link, function(geoData) {
    console.log(geoData);

    // Color Function
    function colorTime(mag) {
        return  mag > 5 ? '#ff0000':
                mag > 4 ? '#ff8c00':
                mag > 3 ? '#ffcc00':
                mag > 2 ? '#eaff00':
                mag > 1 ? '#91ff00':
                '#FFFFFF';
                
    };

    // Circle Size Function
    function sizeTime(mag) {
        return ((Math.pow(2, mag)/2)*10)
    };

    L.geoJson(geoData, {
        style: function(feature) {
            return{
                color: "white",
                // fillColor: chooseColor(feature.properties.ADMIN),
                fillColor: colorTime(feature.properties.mag),
                fillOpacity: 0.5,
                weight: 1.5,
                radius: sizeTime(feature.properties.mag)
            };
        },
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                mouseover: function(event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.9
                    });
                },
                mouseout: function(event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.5
                    });
                },
                // click: function(event) {
                //     map.fitBounds(event.target.getBounds());
                // }
            });
            layer.bindPopup(`Magnitude: ${feature.properties.mag}`);
        }
    }).addTo(map);
    var legend = L.control({position: 'topleft'});
    legend.onAdd = function (map) {
    
      var div = L.DomUtil.create('div', 'info legend'),
        categories = [1, 2, 3, 4, 5],
        labels = ['<strong>Magnitude</strong>'],
        from, 
        to; 
          
      for (var i = 0; i < categories.length; i++) {
        from = categories [i];
        to = categories[i+1];
    
      labels.push(
        '<i style="background:' + colorTime(from + 1) + '"></i> ' +
          from + (to ? '&ndash;' + to : '+'));
          }
          div.innerHTML = labels.join('<br>');
          return div;
      };
      legend.addTo(map);
});



