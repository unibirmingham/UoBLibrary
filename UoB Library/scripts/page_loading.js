$( document ).on( "click", ".show-page-loading-msg", function() {
	showPageLoadingMessage(this)
});

function showPageLoadingMessage(element){
	var $element = $(element),
			theme = $element.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
			msgText = $element.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
			textVisible = $element.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
			textonly = !!$element.jqmData( "textonly" );
	html = $element.jqmData( "html" ) || "";
	$.mobile.loading( "show", {
		text: msgText,
		textVisible: textVisible,
		theme: theme,
		textonly: textonly,
		html: html
	});

}

function hidePageLoadingMessage(){
	$.mobile.loading( "hide" );
}
