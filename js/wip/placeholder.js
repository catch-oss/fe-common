;(function($) {

    "use strict";

    $(function(){

		twoDegrees.placeholder = function() {
			// force ie11 to always use polyholder
			var ua = navigator.userAgent,
	            is_ie11 =  ua.match(/Trident.*rv[ :]*11\./);

	        if(is_ie11 != null){
	        	$('input,textarea').placeholder( {
					force: true
				});
	        } else {
	        	$('input,textarea').placeholder();
	        }
		}

    });

})(jQuery);