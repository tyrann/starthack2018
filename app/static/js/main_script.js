// Leaflet initialization
let mymap = L.map('map_div').setView([46.879, 9.2], 8);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidGltb3phdHRvbCIsImEiOiJjamUwcmU4MmwzcHBlMzJ0MzVmdHdjYWk2In0.zn_GsNKiTI2nJSSc5Mv6cg'
}).addTo(mymap);


// Ion Slider
$("#duration_slider").ionRangeSlider();

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
