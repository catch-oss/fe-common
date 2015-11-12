;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery', './../body-toucher/body-toucher'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../body-toucher/body-toucher'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.dockNav = factory(root.jQuery);
    }

}(this, function ($, bodyToucher, undefined) {

	return function(options) {

		var $nav = $('.dockable-nav-container'),
			$scrollElem = $.scrollElem();

		if (options == 'height') {
			var $inner = $nav.find('.nav-primary');
			if (!$inner.length) $inner = $nav.find('#main-nav');
			return $inner.outerHeight(true);
		}
		else {

			// set offset
			var offset;
			$(window)
				.off('resize.dockNav')
				.on('resize.dockNav', function() {

					var hdTop =  parseInt($('.header').css('marginBottom')),
						navBtm =  parseInt($('#main-nav').css('marginBottom'));

					offset = hdTop + navBtm;
				});

			// handle nav
			if($nav.length){

				// init offset
				$(window).trigger('resize');

				var dockPoint = $nav.offsetTop();

				$scrollElem.on('scroll',function(){

					var scroll = $(this).scrollTop();
					$nav.toggleClass('docked', scroll > dockPoint);

					//apply offset margin
					if(scroll > dockPoint && !$('#main-nav').hasClass('no-secondary')) {
						$('main').css('margin-top', 54);
					}
					else {
						$('main').css('margin-top',0);
					}
				});
			}
		}
	}
}));
