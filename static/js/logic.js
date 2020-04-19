var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    
    var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var myCircleArray = new Array();

    for (var i = 0; i < earthquakeData.length; i++) {

        coordinates = [earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]]
        properties = earthquakeData[i].properties;

        var color = "#ccff33";
        if (properties.mag < 1) {
            color = "#ffff33";
        }
        else if (properties.mag < 2) {
            color = "#ffcc33";
        }
        else if (properties.mag < 3) {
            color = "#ff9933";
        }
        else if (properties.mag < 4) {
            color = "#ff6633";
        }
        else if (properties.mag < 5) {
            color = "ff3333";
        }

        var myCircle = L.circle(coordinates, {
            fillOpacity: 1,
            color: color,
            fillColor: color,
            radus: (properties.mag * 20000)
        }).bindPopup("<h1>" + properties.place + "</h> <hr> <h3>Magnitude: " + properties.mag.toFixed(2) + "</h3>");
        myCircleArray.push(myCircle);

    }
    var earthquakes = L.layerGroup(myCircleArray);

    
    var baseMaps = {
        "Outdoors Map": outdoorsmap,
        "Satellite Map": satellitemap,
        "Grayscale Map": grayscalemap        
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [outdoorsmap, satellitemap, grayscalemap, earthquakes]
    });

    L.control.layers(baseMaps,overlayMaps, { 
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var grades = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
     var color = ["#ffff33", "#ffcc33", "#ff9933", "#ff6633", "ff3333", "#ccff33"];

        for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<p style="margin-left: 15px">' + '<i style="background:' + color[i] + ' "></i>' + '&nbsp;&nbsp;' + grades[i]+ '<\p>';
        }

        return div;

    };

    legend.addTo(myMap)

    myMap.on('overlayadd', function(a) {
        legend.addTo(myMap);
    });

    myMap.on('overlayremove', function(a) {
        myMap.removeControl(legend);
    });
  }



