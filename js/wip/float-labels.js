;(function($) {

    "use strict";

    $(function(){

		twoDegrees.floatLabels = function() {
			$('input:not(.no-label), select:not(.no-label), textarea:not(.no-label)').labelizr({classSwitchOnly: true});
		}

    });

})(jQuery);