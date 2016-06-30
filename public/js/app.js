var runPath = [];
var runPathUrl = [];
var map;
var apiKey = 'AIzaSyCHKEYVYqaOgwp_M3GURu30QKreYxq61bQ';

function initMap() {

  var map = new google.maps.Map(document.getElementById('map'), {
      center: {
          lat: 47.6397,
          lng: -122.3644
      },
      zoom: 17

  });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        map.setCenter(pos);
        });
    };


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

  $(document).ready(function() {

      $("#mapRoute").on('click', function() {

          $("#pushFormToDB").show()

          $("#pushRoutesToDB").show();

          path = [];
          for (var i = 0; i < runPath.length; i++) {
              path.push(runPath[i].lat + ',' + runPath[i].lng);
          };

          $.get('https://roads.googleapis.com/v1/snapToRoads', {
              interpolate: true,
              key: apiKey,
              path: path.join('|')
            },function(data) {
                processSnapToRoadResponse(data);
                if(!data.warningMessage){
                  drawSnappedPolyline();
                };
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
      });

      $("#pushFormToDB").on('submit', function(e) {
          e.preventDefault();
          runPathUrlString = JSON.stringify(runPathUrl);
          runPathString = JSON.stringify(runPath);
          runName = document.getElementById('textInput').value;

          $.ajax({
            type: "POST",
            url: "/runMaps/clientData",
            dataType: "json",
            data: {
                runName: runName,
                runPathUrlString: runPathUrlString,
                runPathString: runPathString
            },
            success: function (data) {
                console.log('Success');
                window.location.replace(window.location.origin + "/runMaps/showAllRuns");
            },
            error: function (err) {
                console.log(err);
            }
          });
      });
  });
};
