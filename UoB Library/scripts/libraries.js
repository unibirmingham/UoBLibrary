var librariesList;

$(function() {

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

});

function injectHtml(data, templateFile, element, success){
	$.get(templateFile, function(tmpl) {
		var html = Mustache.to_html(tmpl, data);
		element.html(html);
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

	var library = jQuery.grep(librariesList.libraries, function(item, i){return item.id == urlObj.hash.replace('#library-record?id=','')});

	injectHtml(library[0], 'templates/library_record.tmpl', $content);

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
