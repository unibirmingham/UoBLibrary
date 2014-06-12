var librariesList;

$(function() {
	google.maps.event.addDomListener(window, "load", initMap);

	$.getJSON("data/libraries.json", function(data){
		librariesList = data;
		var libraryList = $('#libraryList');
		injectHtml(data, 'templates/libraries.tmpl', libraryList, function(){libraryList.listview("refresh");});
	});

	$(document).bind( "pagebeforechange", function( e, data ) {
		if ( typeof data.toPage === "string" ) {
			var u = $.mobile.path.parseUrl( data.toPage ),
		reRecord = /^#library-record/;
		reMap = /^#library-map/;

	if ( u.hash.search(reRecord) !== -1 ) {
		showLibrary( u, data.options );
		e.preventDefault();
	}
	
	if ( u.hash.search(reMap) !== -1 ) {
		showMap( u, data.options );
		e.preventDefault();
	}

		}
	});
	
	$(document).on('pageshow', function(){
		refresh();
	});

	$('#library-map').on("pageshow", function( event ) {
		var currCenter = map.getCenter();
		google.maps.event.trigger(map, 'resize');
		map.setCenter(currCenter);
	} )

	Handlebars.registerHelper('formattedAddress', function(address) {
		return address.replace(/,+/g, "<br />");
	});

});

function injectHtml(data, templateFile, element, success){
	$.get(templateFile, function(tmpl) {
		var template = Handlebars.compile(tmpl);
		element.html(template(data));
		if(success !== undefined){
			success();
		}
	});
}

function refresh() {
	$('.ui-page-active .ui-listview').listview('refresh');
	$('.ui-page-active :jqmData(role=content)').trigger('create');
	$(":jqmData(role=navbar)").navbar();
}

function showLibrary( urlObj, options)
{

	pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	var $page = $( pageSelector ),
			$header = $page.children( ":jqmData(role=header)" ),
			$content = $page.children( ":jqmData(role=content)" );

	var library = findLibrary(urlObj, '#library-record?id=');

	$header.children('h1').text(library.name);	
	injectHtml(library,	'templates/library_record.tmpl', $content.children('#library-details'));

	$page.page();
	options.dataUrl = urlObj.href;
	$.mobile.changePage( $page, options );
}

function findLibrary(urlObj, urlFragment){
	return jQuery.grep(librariesList.libraries, function(item, i){
		return item.id == urlObj.hash.replace(urlFragment,'');
	})[0];

}

function showMap(urlObj, options) {
	pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	var $page = $( pageSelector ),
			$header = $page.children( ":jqmData(role=header)" ),
			$content = $page.children( ":jqmData(role=content)" );

	var library = findLibrary(urlObj, "#library-map?id=");
	$header.children('h1').text(library.name);	

	if((library.lat !== "" && library.lat !== undefined) && (library.long !== "" && library.long !== undefined)){
		map.setCenter(new google.maps.LatLng(library.lat, library.long) );
	}

	$page.page();
	options.dataUrl = urlObj.href;
	$.mobile.changePage( $page, options );
}

function initMap(){
	var mapOptions = {
		zoom: 17,
		center: new google.maps.LatLng(52.450668,-1.930452)
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);
}

