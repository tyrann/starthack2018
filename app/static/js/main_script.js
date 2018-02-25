// Leaflet initialization
let mymap = L.map('map_div').setView([46.879, 9.2], 8);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidGltb3phdHRvbCIsImEiOiJjamUwcmU4MmwzcHBlMzJ0MzVmdHdjYWk2In0.zn_GsNKiTI2nJSSc5Mv6cg'
}).addTo(mymap);

class city {
    constructor(name, lat, long) {
        this.name = name;
        this.lat = lat;
        this.long = long;
    }
  }

let cities = [
  new city('Brig-Gils',	46.319088, 7.987261),
  new city('Davos', 46.791850, 9.820922),
  new city('Disentis/Mustér', 46.705150, 8.855350),
  new city('Zürich', 47.377651, 8.541334),
  new city('Lucerne',	47.050237,	8.310093),
  new city('Zermatt', 46.024506, 7.748359),
  new city('Zweisimmen', 46.553338, 7.375130),
  new city('Flüelen', 46.901601, 8.634253),
  new city('Lugano', 46.004974, 8.946980),
  new city('St. Moritz', 46.497866, 9.845508),
  new city('Montreux', 46.435866, 6.910471),
  new city('Engelberg', 46.819380, 8.402347),
  new city('Gstaad', 46.475076, 7.284203),
  new city('Chur', 46.853498, 9.530211),
  new city('Geneva', 46.210488, 6.142943),
  new city('Locarno', 46.172508, 8.800949),
  new city('Stechelberg (Schilthornbahn)', 46.554788, 7.900880),
  new city('Schaffhausen',	47.697912, 8.6632549),
  new city('Andermatt', 46.636901, 8.593706),
  new city('Berne', 46.948199,	7.440255),
  new city('Lauterbrunnen', 46.598291, 7.907788),
  new city('Wattwil', 47.299428, 9.086591),
  new city('Lausanne', 46.516951,	6.629215),
  new city('Nyon', 46.384325, 6.236002),
  new city('Fribourg', 46.803062,	7.151117),
  new city('Gruyeres', 46.582336, 7.080219),
  new city('St gallen', 47.423168,	9.369774),
  new city('Solothurn', 47.204175,	7.542328),
  new city('Interlaken', 46.682101, 7.851424),
  new city('Belinzona',	46.195293,	9.029191),
  new city('Zug',	47.173506,	8.515229),
  new city('Vevey', 46.462942, 6.843378),
  new city('Thun',	46.755024,	7.629282),
  new city('La chaux-de-fonds',	47.098521,	6.824964),
  new city('Neuchatel', 46.996644,	6.9385661),
  new city('Arolla', 46.0231887, 7.481940),
  new city('Arosa', 46.783690, 9.679261),
  new city('Bienne', 47.132987,	7.242834),
  new city('Sion, Switzerland',	46.227483,	7.359396),
  new city('Altdorf (UR)', 46.875588, 8.631062),
  new city('Delemont', 47.362025, 7.349967),
  new city('Frauenfeld',	47.558206,	8.896743),
  new city('Langenthal',	47.217164,	7.784507),
  new city('le Locle', 47.057894, 6.746354),
  new city('Liestal',	47.484414,	7.731610),
  new city('Olten',	47.352441,	7.907046),
  new city('Martigny',	46.105768,	7.078881),
  new city('Schwyz', 47.026649, 8.632153),
  new city('Stans', 46.958363, 8.366726),
  new city('Val-de-Travers', 46.911697, 6.610216),
  new city('Wil', 47.462483,	9.040725),
  new city('Yverdon-les-bains', 46.781524, 6.640753),
  new city('Meyrin', 46.22561, 6.077305),
  new city('Basel', 47.547667, 7.589539)
]

let train_path_data;

function loadTrainPath(CSV) {
    train_path_data = CSV;
}

function getTrain_Path(trainline) {
  train_path = train_path_data.filter(x => x.route_number == trainline)
  return train_path.geoshape
}

function draw_path(path) {
  let i = 0;
  clearMap(mymap);

  while(i < path.length-1) {
    draw_marker(get_city_by_name(path[i]));
    create_line(path[i], path[i+1]);
    i = i + 1;
  }
  draw_marker(get_city_by_name(path[path.length-1]));
  update_graph();
}

function draw_point(city) {
    var circle = L.circle([city.lat, city.long], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.7,
        radius: 500,
    }).addTo(mymap);
}

function draw_marker(city) {
    let marker = L.marker([city.lat, city.long]);
    mymap.addLayer(marker);
    marker.bindPopup(city.name);
    myMarkers.push(marker);
}

function find_by_name(city, name) {
    if (city.name == name) {
      return city
    }
}

function get_city_by_name(name) {
  return cities.find(x => find_by_name(x, name));
}

let myLines = [];
let myMarkers = [];

function create_line(city_name_1, city_name_2) {
  city1 = get_city_by_name(city_name_1);
  city2 = get_city_by_name(city_name_2);
  myLines.push({
    'type': 'LineString',
    'coordinates': [[city1.long, city1.lat], [city2.long, city2.lat]]
  });
}

var myStyle = {
    "color": "#ed5565",
    "weight": 5,
    "opacity": 0.7
};

function clearMap(m) {
    myLines = [];
    for(i in m._layers) {
        if(m._layers[i]._path != undefined) {
            try {
                m.removeLayer(m._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + m._layers[i]);
            }
        }
    }

    myMarkers.forEach(function (m) {
        mymap.removeLayer(m);
    });
}


function update_graph() {
  L.geoJSON(myLines, {
      style: myStyle
  }).addTo(mymap);
}


// Ion Slider
$("#duration_slider").ionRangeSlider({
    grid: true,
    from: 3,
    values: [
        "1d", "2d", "3d",
        "4d", "5d", "6d",
        "7d", "8d", "9d",
        "10d", "11d", "12d"
    ],
    onChange: function (data) {
        $('#left_panel_form').submit();
    },
});

// Form submission
const TOUR_API_URL = '/api/v1.0/tours'

$('#left_panel_form').on( "submit", function( event ) {
    event.preventDefault();
    let params = $( this ).serialize();

    $.get(TOUR_API_URL, params, function(json) {
        console.log(json);
        draw_path(json.tour);
    });
});

// Fill in the city_selects
city_names = [
    'Brig-Gils',
    'Davos',
    'Disentis/Mustér',
    'Zürich',
    'Lucerne',
    'Zermatt',
    'Zweisimmen',
    'Flüelen',
    'Lugano',
    'St. Moritz',
    'Montreux',
    'Engelberg',
    'Gstaad',
    'Chur',
    'Geneva',
    'Locarno',
    'Stechelberg (Schilthornbahn)',
    'Schaffhausen',
    'Andermatt',
    'Berne',
    'Lauterbrunnen',
    'Wattwil',
    'Lausanne',
    'Nyon',
    'Fribourg',
    'Gruyeres',
    'St gallen',
    'Solerthurn',
    'Interlaken',
    'Belinzona',
    'Zug',
    'Vevey',
    'Thun',
    'La chaux-de-fonds',
    'Neuchatel',
    'Arolla',
    'Arosa',
    'Bienne',
    'Sion, Switzerland',
    'Altdorf (UR)',
    'Delemont',
    'Frauenfeld',
    'Langenthal',
    'le Locle',
    'Liestal',
    'Olten',
    'Martigny',
    'Schwyz',
    'Stans',
    'Val-de-Travers',
    'Wil',
    'Yverdon-les-bains',
    'Meyrin',
    'Basel',
].sort();
d3.selectAll('.city_select').selectAll('option').data(city_names).enter().append('option').text(function (d) { return d; });

const submitButton = d3.select('#submit_button');

// Submit automatically for each form change
d3.selectAll("select").on("change", function () {
    $('#left_panel_form').submit();
});
