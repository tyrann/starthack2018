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
  new city('Brig-Gils',	46.2895968118, 7.9799664005),
  new city('Davos', 46.791850, 9.820922),
  new city('Disentis/Mustér', 46.705150, 8.855350),
  new city('Zürich', 47.3827805142, 8.532496355),
  new city('Lucerne',	47.0562397859,	8.291826794),
  new city('Zermatt', 46.024506, 7.748359),
  new city('Zweisimmen', 46.553338, 7.375130),
  new city('Flüelen', 46.901601, 8.634253),
  new city('Lugano', 46.004974, 8.946980),
  new city('St. Moritz', 46.497866, 9.845508),
  new city('Montreux', 46.435866, 6.910471),
  new city('Engelberg', 46.819380, 8.402347),
  new city('Gstaad', 46.475076, 7.284203),
  new city('Chur',	46.8534076304,	9.5309330213),
  new city('Geneva',	46.2083180994,	6.1444924531),
  new city('Locarno', 46.172508, 8.800949),
  new city('Stechelberg (Schilthornbahn)', 46.554788, 7.900880),
  new city('Schaffhausen',	47.722778094,	8.6258783305),
  new city('Andermatt', 46.636901, 8.593706),
  new city('Berne', 46.9489028306,	7.40730463),
  new city('Lauterbrunnen', 46.598291, 7.907788),
  new city('Wattwil', 47.299428, 9.086591),
  new city('Lausanne', 46.550825219,	6.6584896552),
  new city('Nyon', 46.384325, 6.236002),
  new city('Fribourg', 46.8054534632,	7.1606118285),
  new city('Gruyeres', 46.582336, 7.080219),
  new city('St gallen', 47.4234963687,	9.3768168224),
  new city('Solerthurn', 47.2096905323,	7.5310174971),
  new city('Interlaken', 46.682101, 7.851424),
  new city('Belinzona',	46.2011150625,	9.023746796),
  new city('Zug',	47.1543542227,	8.5118714943),
  new city('Vevey', 46.462942, 6.843378),
  new city('Thun',	46.7478987583,	7.623196545),
  new city('La chaux-de-fonds',	47.1115126997,	6.8342862029),
  new city('Neuchatel', 47.0106288909,	6.9389372339),
  new city('Arolla', 46.0231887, 7.481940),
  new city('Arosa', 46.783690, 9.679261),
  new city('Bienne', 47.1505375233,	7.2620261869),
  new city('Sion',	46.2241745496,	7.3658183584),
  new city('Altdorf (UR)', 46.875588, 8.631062),
  new city('Delemont', 47.3764226768, 7.3338284182),
  new city('Frauenfeld',	47.559409063,	8.8975781032),
  new city('Langenthal',	47.2157021108,	7.8037499886),
  new city('le Locle', 47.057894, 6.746354),
  new city('Liestal',	47.4867978791,	7.7266836248),
  new city('Olten',	47.3462406235,	7.9012004224),
  new city('Martigny',	46.1084253874,	7.0819241484),
  new city('Schwyz', 47.026649, 8.632153),
  new city('Stans', 46.958363, 8.366726),
  new city('Val-de-Travers', 46.911697, 6.610216),
  new city('Wil', 47.4757171459,	9.0517500503),
  new city('Yverdon-les-bains', 46.781524, 6.40753),
  new city('Meyrin', 46.22561, 6.077305)
]

let train_path_data;

function loadTrainPath(CSV) {
    train_path_data = CSV;
}

function getTrain_Path(trainline) {
  train_path = train_path_data.filter(x => x.route_number == trainline)
  return train_path.geoshape
}

d3.csv('static/datasets/train_route.csv', loadTrainPath);

function draw_path(path) {
  n = path.length
  let i = 0
  while(i < n-1) {
    create_line(path[i], path[i+1])
    i = i + 1
  }
  update_graph()
}

function find_by_name(city, name) {
    if (city.name == name) {
      return city
    }
}

function get_city_by_name(name) {
  return cities.find(x => find_by_name(x, name));
}

var myLines = []

function create_line(city_name_1, city_name_2) {
  city1 = get_city_by_name(city_name_1);
  city2 = get_city_by_name(city_name_2);
  myLines.push({
    'type': 'LineString',
    'coordinates': [[city1.long, city1.lat], [city2.long, city2.lat]]
  });
}

/*
var myLines = [{'coordinates': [[6.39970400408, 46.4757395273],
   [6.42713908598, 46.4751599503]],
  'type': 'LineString'},
 {'coordinates': [[6.54050855527, 46.5291203863],
   [6.5417981566, 46.5307409033]],
  'type': 'LineString'},
 {'coordinates': [[6.5417981566, 46.5307409033],
   [6.5508823384, 46.5347796473]],
  'type': 'LineString'},
 {'coordinates': [[6.42713908598, 46.4751599503],
   [6.45590462293, 46.4823041329]],
  'type': 'LineString'},
 {'coordinates': [[6.42713908598, 46.4751599503],
   [6.45590462293, 46.4823041329]],
  'type': 'LineString'},
 {'coordinates': [[6.11552023469, 46.2087560586],
   [6.12772692721, 46.2055517047]],
  'type': 'LineString'},
 {'coordinates': [[6.11552023469, 46.2087560586],
   [6.12772692721, 46.2055517047]],
  'type': 'LineString'},
 {'coordinates': [[6.14455938175, 46.222435146],
   [6.14733924476, 46.2423769792]],
  'type': 'LineString'},
 {'coordinates': [[6.52102415523, 46.5236117496],
   [6.52434058739, 46.5247990334]],
  'type': 'LineString'}
]
;
*/

var myStyle = {
    "color": "red",
    "weight": 5,
    "opacity": 1
};

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
    ]
});

// Form submission
const TOUR_API_URL = 'http://127.0.0.1:5000/api/v1.0/tours?'

$('#left_panel_form').on( "submit", function( event ) {
    event.preventDefault();
    let params = $( this ).serialize();

    $.get(TOUR_API_URL + params, function(json) {
        console.log(json);
        alert("Success");
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
    'Sion',
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
].sort();
d3.selectAll('.city_select').selectAll('option').data(city_names).enter().append('option').text(function (d) { return d; });
