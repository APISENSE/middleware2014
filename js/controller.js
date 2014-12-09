$(document).ready(function() {
	initializeForm();

	var browerHeight = $(window).height(),
		navHeight = $('.navbar-aps').height(),
		formHeight = $('#wrapper-form').height(),
		footerHeight = $('.footer').height()+60;

	// Set map height
	if(browerHeight>640) {
		$('#map-canvas').height(browerHeight - navHeight - formHeight - footerHeight);
		$('.container-fluid').addClass('nomargin stickytonav');
	}

	$(".close-alert").click(function() {
  		$(".alert").hide();
	});
});

// Deciders
$("#mapFilterForm").submit( function() {
	// "input:radio[name=mapType]:checked" ).val()
	initialize();
	data($("select[name=mapType]").val(), $("select[name=userID]").val(),$("input[name=from]").val(),$("input[name=to]").val());
	return false;
 });

$("#cleanMap").click( function() {
	initialize();
 });

// Helpers
function createMarker(coordinates) {
	return new google.maps.Marker({
		position: coordinates
	});
}

/** Not super sexy but it works.. **/
function queryBuilder(userID, from, to) {
	var allUsers = false;
	if (userID === "all") allUsers = true;

	/* Ajust dates if necessary */
	if (from == "") from = 0; else from = (moment(from).unix() * 1000);
	if (to == "") to = new Date().getTime(); else to = (moment(to).unix() * 1000);

	/* Build query */
	if (allUsers)
		return "from="+from+"&to="+to
	else
		return "userID="+userID+"&from="+from+"&to="+to
}

/** Get data and display... Not perfect but hey.. it's ok **/
function data(type, userID, from, to) {
	var query = queryBuilder(userID, from, to);

	$.ajax({
		type: "GET",
		url: url,
		data: query,
		success: function(data){
			var markersArray = [];
			var latlngArray = [];
			$.each(data, function(i, item) {
				if(data[i].data.hasOwnProperty('coordinates')) {
					var lat = data[i].data.coordinates.latitude;
					var lng = data[i].data.coordinates.longitude;
					var latlng = new google.maps.LatLng(lat, lng);
					markersArray.push(createMarker(latlng));
					latlngArray.push(latlng);
				}
			});

			var feedback = document.getElementById("feedback");
			if (latlngArray.length == 0) {
				feedback.style.display = "block";
				return;
			} else {
				feedback.style.display = "none";
				var last = latlngArray.slice(-1)[0];
				setGoogleMapPosition(last.lat(), last.lng());
			}

			/** Switch between clusters and heat map */
			if (type === "clusters")
				new MarkerClusterer(map, markersArray);
			else {
				var pointArray = new google.maps.MVCArray(latlngArray);
				mapHeat = new google.maps.visualization.HeatmapLayer({
					data: pointArray
				});
				mapHeat.setMap(map);
			}
		}
	});
}

function setGoogleMapPosition(latitude, longitude) {
	map.setCenter({lat: latitude, lng: longitude});
}

/** Retrieve and display all users **/
function initializeForm() {
	$.ajax({
		type: "GET",
		url: url,
		success: function(data){
			$("#userID").append('<option value="all" selected>All users</option>');
			$.each(data, function(i, item) {
				// Avoid duplicata
				if ($("#userID option[value='"+data[i].user+"']").length == 0) {
					if(data[i].hasOwnProperty('user') && data[i].data.hasOwnProperty('coordinates')) {
						$("#userID").append('<option value="'+data[i].user+'">'+data[i].user+'</option>');
					}
				}
			});
		}
	});
}