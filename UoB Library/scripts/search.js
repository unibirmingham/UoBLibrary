var searchResults;

$(function() {
	route('search-record', showSearchRecord);

	$('#search-button').click(function(e){
		var searchTerm = $('#search-box').val();
		$('.ui-page-active h1').text(searchTerm);
		$.get('http://findit-s.bham.ac.uk:1701/PrimoWebServices/xservice/search/brief?institution=44BIR&onCampus=false&query=any,contains,' + searchTerm + '&indx=1&bulkSize=10&dym=true&highlight=true&lang=eng',
			function(xml){ 
				var json = $.xml2json(xml);
				listOfResults = $('#search-result-list');
				searchResults = { records: json.JAGROOT.RESULT.DOCSET.DOC, searchTerm: searchTerm };
				injectHtml(searchResults, 'templates/search_results.tmpl', listOfResults);
				listOfResults.listview().listview('refresh');
			}); 
		e.preventDefault();
	});

});

function showSearchRecord(urlObj, options){
	showPage(urlObj, options, function(page) {	
		var result = findSearchResult(urlObj, "#search-record?recordid=");
		page.header.children('h1').text(result.display.title);	
		element = page.content.children('#search-record-details');
		injectHtml(result,	'templates/search_record.tmpl', element);
		element.trigger('create');

		options.transition = 'slide';
	})

}

function findSearchResult(urlObj, urlFragment){
	return jQuery.grep(searchResults.records, function(item, i){
		var param = urlObj.hash.replace(urlFragment, '');
		return item.PrimoNMBib.record.control.recordid === decodeURIComponent(param);
	})[0].PrimoNMBib.record;
}

Handlebars.registerHelper('httpEncoded', function(text) {
	return encodeURIComponent(text);
});
