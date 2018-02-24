// Leaflet initialization
let mymap = L.map('map_container').setView([46.879, 9.2], 8);


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidGltb3phdHRvbCIsImEiOiJjamUwcmU4MmwzcHBlMzJ0MzVmdHdjYWk2In0.zn_GsNKiTI2nJSSc5Mv6cg'
}).addTo(mymap);


// Ion Slider
$("#duration_slider").ionRangeSlider();
