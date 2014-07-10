var searchResults;
var nextTenButton;

$(function() {
	route('search-record', showSearchRecord);
	nextTenButton = $('#next-ten-button');

	$('#search-button').click(function(e){
		var searchTerm = $('#search-box').val();
		$('.ui-page-active h1').text(searchTerm);
		nextTenButton.data("index", 1);
		getSearchResults(searchTerm, null, injectHtml);
		e.preventDefault();
	});

	nextTenButton.click(function(e) {
		searchTerm = $('#search-box').val();
		getSearchResults(searchTerm, nextTenButton.data('index'), appendHtml);
		e.preventDefault();
	});

});

function getSearchResults(searchTerm, index, templateResults){
	$.get(getSearchUrl(searchTerm, index), function(json){ 
		listOfResults = $('#search-result-list');
		searchResults = { records: json, searchTerm: searchTerm };
		templateResults(searchResults, 'templates/search_results.tmpl', listOfResults);
		listOfResults.listview().listview('refresh');
		nextTenButton.data("index", nextTenButton.data("index")+ 10);

		if(json.length < 10){
			nextTenButton.hide();
		}
		else {
			nextTenButton.show();
		}
	}); 
}

function getSearchUrl(searchTerm, index){
	url = 'http://butler.bham.ac.uk/library/search/?q=' + searchTerm;
	url += '&size=10';
	if(index){
		url += '&index=' + index
	}
	return url;
}

function showSearchRecord(urlObj, options){
	showPage(urlObj, options, function(page) {	
		var result = findSearchResult(urlObj, "#search-record?recordid=");
		groupItemsFor(result);
		page.header.children('h1').text(result.title);	
		element = page.content.children('#search-record-details');
		injectHtml(result,	'templates/search_record.tmpl', element);
		element.trigger('create');

		options.transition = 'slide';
	})

}

function findSearchResult(urlObj, urlFragment){
	var record_id = urlObj.hash.replace(urlFragment, '');
	var json;
	$.ajax({
		url: 'http://butler.bham.ac.uk/library/work/' + record_id,    
		success: function(response) { 
			json = response;
		},
		async: false
	});
	return json;
}

function groupItemsFor(searchResult){
	if (searchResult.items !== undefined || searchResult.items.length > 0){
		groupedItems = {};
		$.each(searchResult.items, function(i, item){
			if(groupedItems[item.location] === undefined){
				groupedItems[item.location] = [item];
			}
			else {
				groupedItems[item.location].push(item)
			}
			item.isAvailable = isAvailable;
		});
		searchResult["groupedItems"] = groupedItems;
	}
}

function isAvailable() {
	return this.loan_status !== "A";
}

Handlebars.registerHelper('httpEncoded', function(text) {
	return encodeURIComponent(text);
});

Handlebars.registerHelper('lookUpLoanStatus', function(text) {
	if(text === "A"){
		return "On Loan"
	}
	return "Available"
});

Handlebars.registerHelper('formattedLoanDueDate', function(text) {
	returnDate = moment(text, "YYYYMMDD");
	return returnDate.fromNow() + ' (' + returnDate.format("Do MMMM YYYY") + ')';
		});

