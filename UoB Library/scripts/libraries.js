var librariesList;

$(function() {
	google.maps.event.addDomListener(window, "load", initMap);

	$.getJSON("data/libraries.json", function(data){
		var libraryList = $('#libraryList');
		injectHtml(data, 'templates/libraries.tmpl', libraryList, function(){libraryList.listview("refresh");}); 
		librariesList = data;
	});

	$(document).bind( "pagebeforechange", function( e, data ) {
		if ( typeof data.toPage === "string" ) {
			var u = $.mobile.path.parseUrl( data.toPage ),
		re = /^#library-record/;

	if ( u.hash.search(re) !== -1 ) {
		showLibrary( u, data.options );
		e.preventDefault();
	}
		}
	});

	$('#library-record').on("pageshow", function( event ) {
		google.maps.event.trigger(map, 'resize');
	} )

	Handlebars.registerHelper('formattedAddress', function(address) {
		return address.replace(/,+/g, "<br />");
	});

});

function sayHello(){
	return "hello";
}

function injectHtml(data, templateFile, element, success){
	$.get(templateFile, function(tmpl) {
		var template = Handlebars.compile(tmpl);
		element.html(template(data));
		if(success !== undefined){
			success();
		}
	});
}


function showLibrary( urlObj, options )
{

	pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	//	Get the page we are going to dump our content into.
	var $page = $( pageSelector ),

			// Get the header for the page.
			$header = $page.children( ":jqmData(role=header)" ),

			// Get the content area element for the page.
			$content = $page.children( ":jqmData(role=content)" );

	var library = jQuery.grep(librariesList.libraries, function(item, i){
		return item.id == urlObj.hash.replace('#library-record?id=','');
	})[0];

	$header.children('h1').text(library.name)	
		injectHtml(library, 'templates/library_record.tmpl', $content.children('#library-details'));
	if((library.lat !== "" && library.lat !== undefined) && (library.long !== "" && library.long !== undefined)){
		map.setCenter(new google.maps.LatLng(library.lat, library.long) );
	}
	$page.page();


	// We don't want the data-url of the page we just modified
	// to be the url that shows up in the browser's location field,
	// so set the dataUrl option to the URL for the category
	// we just loaded.
	options.dataUrl = urlObj.href;


	// Now call changePage() and tell it to switch to
	// the page we just modified.
	$.mobile.changePage( $page, options );

}

function initMap(){
	var mapOptions = {
		zoom: 18,
		center: new google.maps.LatLng(52.450668,-1.930452)
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);

}
