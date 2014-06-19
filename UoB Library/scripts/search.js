$(function() {
	route('search-record', showSearchRecord);

	$('#search-button').click(function(){
		$.get('http://findit-s.bham.ac.uk:1701/PrimoWebServices/xservice/search/brief?institution=44BIR&onCampus=false&query=any,contains,english&indx=1&bulkSize=2&dym=true&highlight=true&lang=eng',
			function(xml){ 
				var json = $.xml2json(xml);

			}); 
	});

});

function showSearchRecord(){


}
