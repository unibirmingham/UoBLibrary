var librariesList;

$(function() {
	google.maps.event.addDomListener(window, "load", initMap);

	loadLibraries();

	route('library-record', showLibrary);
	route('library-map', showMap);

	$('#library-map').on("pageshow", function( event ) {
		var currCenter = map.getCenter();
		google.maps.event.trigger(map, 'resize');
		map.setCenter(currCenter);
	} )

	Handlebars.registerHelper('formattedAddress', function(address) {
		return address.replace(/,+/g, "<br />");
	});

});

function loadLibraries() {
	$.getJSON("data/libraries.json", function(data){
		librariesList = data;
		var libraryList = $('#libraryList');
		injectHtml(data, 'templates/libraries.tmpl', libraryList, function(){libraryList.listview("refresh");});
	});
}

function showLibrary( urlObj, options)
{
	showPage(urlObj, options, function(page) {	
		var library = findLibrary(urlObj, "#library-record?id=");
		page.header.children('h1').text(library.name);	
		element = page.content.children('#library-details');
		injectHtml(library,	'templates/library_record.tmpl', element);
		element.trigger('create');

		options.transition = 'slide';
	})
}

function showMap(urlObj, options) {
	showPage(urlObj, options, function(page) {	
		var library = findLibrary(urlObj, "#library-map?id=");
		page.header.children('h1').text(library.name);	
		var libLatLng = new google.maps.LatLng(library.lat, library.long); 

		if((library.lat !== "" && library.lat !== undefined) && (library.long !== "" && library.long !== undefined)){
			map.setCenter(libLatLng);

			var marker = new google.maps.Marker({
				position: libLatLng,
					map: map,
					title: library.name 
			});
		}
	});
}

function findLibrary(urlObj, urlFragment){
	return jQuery.grep(librariesList.libraries, function(item, i){
		return item.id == urlObj.hash.replace(urlFragment,'');
	})[0];
}

function initMap(){
	var mapOptions = {
		zoom: 17,
		center: new google.maps.LatLng(52.450668,-1.930452)
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);
}
