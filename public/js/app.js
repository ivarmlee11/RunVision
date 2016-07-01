var runPath = [];
var runPathUrl = [];
var map;
var apiKey = 'AIzaSyCHKEYVYqaOgwp_M3GURu30QKreYxq61bQ';

function initMap() {

    // google maps object created

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 47.6397,
            lng: -122.3644
        },
        zoom: 14
    });

    // checks if geolocation is available

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        });
    };

    // allows markers to be placed on the map
    // once the map is clicked a button appears below the map
    // which allows the user to play a slide show

    google.maps.event.addListener(map, 'click', function(event) {
        $("#mapRoute").show();
        var marker = new google.maps.Marker({
            position: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            },
            map: map
        });

        // on click lat lngs from google map pushed to an array

        runPath.push({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        });
    });

    // still inside the intitiate map function

    $(document).ready(function() {

        // on click forms and buttons are shown to allow user to save runs

        $("#mapRoute").on('click', function() {

            $("#pushFormToDB").show()

            $("#pushRoutesToDB").show();

            // fixing the runpath data so I can use the path array
            // as a key in my ajax call to snaptoroads api
            // I am taking the clicked points on a map trying to convert them
            // to snap to roads points

            path = [];
            for (var i = 0; i < runPath.length; i++) {
                path.push(runPath[i].lat + ',' + runPath[i].lng);
            };

            // ajax call to convert points

            $.get('https://roads.googleapis.com/v1/snapToRoads', {
                interpolate: true,
                key: apiKey,
                path: path.join('|')
            }, function(data) {
                processSnapToRoadResponse(data);
                if (!data.warningMessage) {
                    drawSnappedPolyline();
                };
            });

            // store snapped polyline

            function processSnapToRoadResponse(data) {
                snappedCoordinates = [];
                for (var i = 0; i < data.snappedPoints.length; i++) {
                    var latlng = new google.maps.LatLng(
                        data.snappedPoints[i].location.latitude,
                        data.snappedPoints[i].location.longitude);
                    snappedCoordinates.push(latlng);
                }
            };

            // draws a polyline

            function drawSnappedPolyline() {
                var snappedPolyline = new google.maps.Polyline({
                    path: snappedCoordinates,
                    strokeColor: 'black',
                    strokeWeight: 3
                });
                snappedPolyline.setMap(map);
            };

            // image links created from the clicked points on the map

            for (var i = 0; i < runPath.length; i++) {
                runPathUrl.push('https://maps.googleapis.com/maps/api/streetview?size=400x400&location=' +
                    runPath[i].lat + ',' + runPath[i].lng + '&fov=90&pitch=0&key=' + apiKey + '');
            };

            // interval set to recenter map on points from an array

            var index = 0;
            intervalID = window.setInterval(function() {
                index++;
                if (index >= runPathUrl.length) {
                    index = 0;
                }
                map.setCenter(runPath[index]);
            }, 2000);

            for (var i = 0; i < runPathUrl.length; i++) {
                $('.autoplay').append('<div><img src="' + runPathUrl[i] + '"></div>');
            };

            // slick slider starts

            $('.autoplay').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 1850,
                prevArrow: false,
                nextArrow: false
            });
        });

        // on click event wraps an ajax call to push run data to an array

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
                success: function(data) {
                    console.log('Success');
                    window.location.replace(window.location.origin + "/runMaps/showAllRuns");
                },
                error: function(err) {
                    console.log(err);
                }
            });
        });
    });
};
