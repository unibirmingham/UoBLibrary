function route(pageId, success){
	$(document).bind( "pagebeforechange", function( e, data ) {
		if ( typeof data.toPage === "string" ) {
			var u = $.mobile.path.parseUrl(data.toPage);
			regEx = new RegExp('^#' + pageId);

			if ( u.hash.search(regEx) !== -1 ) {
				success( u, data.options );
				e.preventDefault();
			}
		}
	});
}

function buildHtml(data, templateFile, element, success, handleHtml){
	jQuery.ajax({
		url: templateFile,    
		success: function(tmpl) { var template = Handlebars.compile(tmpl);
			handleHtml(template(data));
			if(success !== undefined){
				success();
			}
		},
		async: false
	});
}

function injectHtml(data, templateFile, element, success){
	buildHtml(data, templateFile, element, success, function(html) { element.html(html) });
}

function appendHtml(data, templateFile, element, success){
	buildHtml(data, templateFile, element, success, function(html) { element.append(html) });
}

function showPage(urlObj, options, renderPage)
{
	pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	var $page = $( pageSelector ),
			$header = $page.children( ":jqmData(role=header)" ),
			$content = $page.children( ":jqmData(role=content)" );
	$page.header = $header;
	$page.content = $content

	renderPage($page);	

	$page.page();
	options.dataUrl = urlObj.href;
	$.mobile.changePage( $page, options );
}
