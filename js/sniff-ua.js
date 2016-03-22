;(function (root, factory) {

     // AMD. Register as an anonymous module depending on jQuery.
     if (typeof define === 'function' && define.amd) define(['jquery'], factory);

     // Node, CommonJS-like
     else if (typeof exports === 'object') module.exports = factory(require('jquery'));

     // Browser globals (root is window)
     else {
         root.catch = (root.catch || {});
         root.catch.sniffUA = factory(root.jQuery);
     }

}(this, function ($, undefined) {

	return function() {

		$(function() {

			// vars
			var is_android, is_chrome, res, ua, is_ios;

			// do the sniffing
			ua = navigator.userAgent;
			is_android = /Android/.test(ua);
			is_chrome = /Chrome/.test(ua);
			is_ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

			// let everyone know it's ios
			if (is_ios) $('html').addClass('ios');

			// android stuff
			if (is_android) {

				// let everyone know it's an android
				$('html').addClass('android');

				// indetify if it's the "native" browser
				if (!is_chrome) {
					res = ua.match(/Android [^;]+/);
					if (res != null && res.length) {
						$('html').addClass('android--stock android--stock--' + res[0].split(' ').join('-'));
					}
				}
			}
		});
	};
}));
