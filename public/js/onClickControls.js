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
});

$("#delete").on('click', function(e) {
  e.preventDefault();
  var deleteElement = $(this);
  var deleteUrlPattern = deleteElement.attr('href');
  $.ajax({
    method: 'DELETE',
    url: deleteUrlPattern
  }).done(function(data) {
    console.log(data);
    deleteElement.remove();
  });
});

