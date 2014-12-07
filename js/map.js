var url = "http://apisense.io/api/v1/589WAYV6DbtzbNk9e3OE/data";

var map;
var mapClustered;
var mapHeat;

var bordeaux = {
	lat: 44.8333,
	lng: -0.5667
};

/**
 * GeoLoc style+behavior
 * @param {[type]} controlDiv Div to insert the element
 * @param {[type]} map        Instance of Google Map
 */
function GeolocControl(controlDiv, map) {
  controlDiv.style.padding = '0px 0px 5px 32px';

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.border = '1px solid #ff8533';
  controlUI.style.borderRadius = '15px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Find me';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.color = '#ff8533';
  controlText.style.fontSize = '11px';
  controlText.style.padding = '3px 6px';
  controlText.innerHTML = '<i class="fa fa-location-arrow"></i>';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to bordeaux
  google.maps.event.addDomListener(controlUI, 'click', function() {
	if(navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {
	      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

	      var infowindow = new google.maps.InfoWindow({
	        map: map,
	        position: pos,
	        content: 'You!'
	      });

	      map.setCenter(pos);
	    }, function() {
	      handleNoGeolocation(true);
	    });
	  } else {
	    // Browser doesn't support Geolocation
	    handleNoGeolocation(false);
	  }

    map.setCenter(new google.maps.LatLng(bordeaux.lat, bordeaux.lng));
  });
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(bordeaux.lat, bordeaux.lng),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

/**
 * Initialize Google Maps
 */
function initialize() {
	var mapOptions = {
		zoom: 12,
		scrollwheel: false,
		center: new google.maps.LatLng(bordeaux.lat, bordeaux.lng)
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	mapClustered = new MarkerClusterer(map);

  	var homeControlDiv = document.createElement('div');
  	var homeControl = new GeolocControl(homeControlDiv, map);

  	homeControlDiv.index = 1;
  	map.controls[google.maps.ControlPosition.LEFT_TOP].push(homeControlDiv);
}

/**
 * Load Google Maps scripts
 */
function loadScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
	'callback=initialize&libraries=visualization';
	document.body.appendChild(script);

	var script_cluster = document.createElement('script');
	script_cluster.type = 'text/javascript';
	script_cluster.src = 'http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js';
	document.body.appendChild(script_cluster);
}

window.onload = loadScript;