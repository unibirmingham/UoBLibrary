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
				searchResults = { searchResults: json.JAGROOT.RESULT.DOCSET.DOC, searchTerm: searchTerm };
				injectHtml(searchResults, 'templates/search_results.tmpl', listOfResults);
				listOfResults.listview().listview('refresh');
			}); 
		e.preventDefault();
	});

});

function showSearchRecord(){


}
