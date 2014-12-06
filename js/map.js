var url = "http://apisense.io/api/v1/589WAYV6DbtzbNk9e3OE/data";
// http://localhost:9000/api/v1/ZzJnQzkkRehWrqXXomA5/data

var map;
var mapClustered;
var mapHeat;

function initialize() {
	var mapOptions = {
		zoom: 12,
		scrollwheel: false,
		center: new google.maps.LatLng(44.8333, -0.5667) // Bordeaux : 44.8333, -0.5667
	};

	map = new google.maps.Map(document.getElementById('map-canvas'),
	mapOptions);
	mapClustered = new MarkerClusterer(map);
}

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