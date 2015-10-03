/**
 * Map component behaviours
 */


var styles = require('./styles'),
	places = require('./places');

var Map = function (el) {

	this.el = el;
	this.mapEl = el.querySelector('.map_canvas');

	var mapOptions = {
		zoom: 13,
		center: new google.maps.LatLng(places.castle.lat, places.castle.lng),
		styles: styles
	};

	this.map = new google.maps.Map(this.mapEl, mapOptions);

	this.popups = [];

	Object.keys(places).forEach(function (placeKey) {
		var place = places[placeKey];
		var icon = {
			url: '/img/'+place.icon,
			scaledSize: place.main ? new google.maps.Size(34, 46) : new google.maps.Size(22, 30)
		};
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(place.lat, place.lng),
			map: this.map,
			title: place.title,
			icon: icon
		});
		var popup = new google.maps.InfoWindow({
			content: '<h1>'+place.title+'</h1>'+'<p>'+place.description + '</p><p><a target="_blank" href="'+place.link+'">Website</a></p>'
		});
		marker.addListener('click', function () {
			this.popups.forEach(function (p) {
				p.close();
			});
			popup.open(this.map, marker);
		}.bind(this));
		this.popups.push(popup);
	}.bind(this));
};

Map.prototype = {
	
};

google.maps.event.addDomListener(window, 'load', function () {
	var mapEls = document.querySelectorAll('.map');
	for (var i = 0; i < mapEls.length; i++) {
		new Map(mapEls[i]);
	}
});

module.exports = Map;