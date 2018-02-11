//location details
//loads locations, coordinates, images and titles from Wikipedia
function loadData(titles) {
	titles = titles || [
		"Nevada_Fall",
		"Yosemite_Falls",
		"Bridalveil_Fall",
		"Vernal_Fall",
		"Horsetail_Fall_(Yosemite)",
		"Ribbon_Fall",
		"Chilnualna_Falls",
		"Illilouette_Falls",
		"Lehamite_Falls",
		"Quaking_Aspen_Falls",
		"Royal_Arch_Cascade",
		"Silver_Strand_Falls",
		"Snow_Creek_Falls",
		"Staircase_Falls",
		"Three_Chute_Falls",
		"Tueeulala_Falls",
		"Wapama_Falls",
		"Waterwheel_Falls",
		"Wildcat_Falls"
	].sort();

	var url = "https://en.wikipedia.org/w/api.php";
	url += '?' + $.param({
		'origin': "*",
		'action': "query",
		'format': "json",
		'prop': "coordinates|pageimages",
		'pithumbsize': "340",
		'titles': titles.join('|')
	});

	var promise = fetch(url)
		.then(response => response.json())
		.then(function (result) {
			var data = [];

			for (var pageId in result.query.pages) {
				var page = result.query.pages[pageId];

				//console.log("element", page)
				if (!page.coordinates || page.coordinates.length < 1) {
					//console.log("missing coordinates", page)
					continue;
				}
				//convert in desired format
				var pointOfInterest = {
					"title": page.title,
					"coordinate": {
						lat: page.coordinates[0].lat,
						lng: page.coordinates[0].lon
					},
					"image": page.thumbnail.source
				};

				data.push(pointOfInterest);
			}

			return data;
		}).catch(function (error) {
			//console.log(error);
			throw error;
		});

	return promise;
}

//calculate center of locations
function centerOfLocations(locations) {
	var count = 0;
	var sumOfLat = 0;
	var sumOfLng = 0;
	locations.forEach(function (location) {
		sumOfLat += location.coordinate.lat;
		sumOfLng += location.coordinate.lng;
		count++;
	});
	//console.log("count", count, sumOfLat, sumOfLng);
	return { lat: sumOfLat / count, lng: sumOfLng / count };
}

//manage Google Map API
function MapManager(locations) {
	//console.log("locations", locations);
	var mapManager = this;

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.TOP_CENTER
		},
		//average of location
		center: centerOfLocations(locations)
	});


	this.markers = [];
	
	var infowindow = new google.maps.InfoWindow({
		//content: markerContent,
	});

	var addMarker = (location) => {
		var lat = location.coordinate.lat;
		var lng = location.coordinate.lng;
		var position = { lat: lat, lng: lng };

		var marker = new google.maps.Marker({
			position: position,
			//label: location.title,
			map: map
		});

		marker.location = location;

		//clousers
		marker.openWindow = function () {
			var markerContent = ' <h2>{{title}}</h2> <img src="{{src}}">'
				.replace("{{src}}", location.image)
				.replace("{{title}}", location.title);

			infowindow.setContent(markerContent)
			infowindow.open(map, marker);
		};

		marker.closeWindow = function () {
			infowindow.close(map, marker);
		};

		marker.blink = function (){
			mapManager.markers.forEach( marker => marker.setAnimation(null));
		
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				marker.setAnimation(null);
			}, 2150);
		};

		marker.addListener('click',  () => {
			//map.setZoom(13);
			//map.setCenter(marker.getPosition());
			mapManager.selectMarker(location);
			//marker.blink();
		});

		this.markers.push(marker);
	};

	locations.forEach(addMarker);

	this.showMarkers = (markerLocations) => {
		//console.log("showMarkers", markerLocations);
		//remove old markers
		this.markers.forEach(marker => {
			marker.setMap(null);
		});
		//add new markers
		//markerLocations;
		markerLocations.forEach(addMarker);
	};

	this.selectMarker = function (location) {
		//console.log("selectMarker", location);
		//center map
		map.setCenter(location.coordinate);
		//open marker window
		//infowindow.open(map, marker);
		this.markers.forEach(marker => {
			//console.log("addMarker", addMarker);
			if (marker.location.title === location.title) {
				marker.openWindow();
				marker.blink();
			} 
		});
	};
}


//VEW MODEL
// Overall viewmodel for this screen, along with initial state
function ViewModel() {
	var self = this;
	self.titles = ko.observableArray([]);

	self.filteredLocations = ko.computed(function () {
		return self.titles().filter(location =>
			location.title.toLowerCase().indexOf(self.search().toLowerCase()) >= 0);
	}, self);

	self.search = ko.observable("");

	// self.filteredLocations.subscribe(() => {
	// 	console.log("filteredLocations", self.filteredLocations())
	// })

	self.setLocations = function (locations) {
		locations.forEach(location => {
			self.titles.push(location);
		});
	};

	self.clickMe = function (location, event) {
		//console.log("clickMe", location, event);
	};
}
//var data = loadData();

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

//called by google maps, when map is ready
function mapLoaded(a,b,c) {
	//load locations from Wikipedia
	loadData().then(function (locations) {
		//console.log("locations", locations);
		var mapManager = new MapManager(locations);
		//console.log("mapManager.markers", mapManager.markers)
		//load initial locations
		viewModel.setLocations(locations);
		//show map markers based on search results
		viewModel.filteredLocations.subscribe(() => {
			mapManager.showMarkers(viewModel.filteredLocations());
		});
		//center selected locations and close menu on click
		viewModel.clickMe = function (location) {
			mapManager.selectMarker(location);
			closeMenu();
			//changeOpacity();
		};
	})
		.catch(error => {
			alert("Something went wrong.\n" + error.message);
		});
}

//toggle menu
function toggleMenu() {
	document.body.classList.toggle("menu-open");
}

function closeMenu() {
	document.body.classList.remove("menu-open");
}

document.getElementById("menu-button").addEventListener("click", () => {
	toggleMenu();
});


function gm_authFailure(d1) { 
	alert("Failed to load the map(Authenticatin failure). Please try later.")
};

function mapLoadError() { 
	alert("Failed to load the map. Please try again later.")
};