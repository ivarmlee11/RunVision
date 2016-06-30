var runPath = [];
var runPathUrl = [];
var map;
var run;
var apiKey = 'AIzaSyCHKEYVYqaOgwp_M3GURu30QKreYxq61bQ';

function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 47.6397,
            lng: -122.3644
        },
        zoom: 13
    });

    var infoWindow = new google.maps.InfoWindow({map: map});
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

    google.maps.event.addListener(map, 'click', function(event) {
        $("#mapRoute").show();
        var marker = new google.maps.Marker({
            position: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            },
            map: map
        });
        runPath.push({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        });
    });

  // Store snapped polyline returned by the snap-to-road service.
function processSnapToRoadResponse(data) {
  snappedCoordinates = [];
  for (var i = 0; i < data.snappedPoints.length; i++) {
    var latlng = new google.maps.LatLng(
        data.snappedPoints[i].location.latitude,
        data.snappedPoints[i].location.longitude);
    snappedCoordinates.push(latlng);
  }
};

// Draws the snapped polyline (after processing snap-to-road response).
function drawSnappedPolyline() {
  var snappedPolyline = new google.maps.Polyline({
    path: snappedCoordinates,
    strokeColor: 'black',
    strokeWeight: 3
  });
  snappedPolyline.setMap(map);
};

for (var i = 0; i < runPath.length; i++) {
    runPathUrl.push('https://maps.googleapis.com/maps/api/streetview?size=400x400&location=' +
        runPath[i].lat + ',' + runPath[i].lng + '&fov=90&pitch=0&key=' + apiKey + '');
};

var index = 0;
intervalID = window.setInterval(function() {
    index++;
    if (index >= runPathUrl.length) {
        index = 0;
    }
    map.setCenter(runPath[index]);
    $('#results').html('<img src="' + runPathUrl[index] + '">');
}, 2000);


};
