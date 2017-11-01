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

} (this, function ($, undefined) {

	return function() {

		$(function() {

			// vars
			var isAndroid, isChrome, res, ua, isIos, detectIE, isSafari;

			// do the sniffing
			ua = navigator.userAgent;
			isAndroid = /Android/.test(ua);
			isChrome = /Chrome/.test(ua);
			isSafari = /Version\/[\d\.]+.*Safari/.test(ua);
			isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

			// let everyone know it's chrome
			if (isChrome) $('html').addClass('chrome');

			// let everyone know it's safari
			if (isSafari) $('html').addClass('safari');

			// let everyone know it's ios
			if (isIos) $('html').addClass('ios');

			// android stuff
			if (isAndroid) {

				// let everyone know it's an android
				$('html').addClass('android');

				// indetify if it's the "native" browser
				if (!isChrome) {
					res = ua.match(/Android [^;]+/);
					if (res != null && res.length) {
						$('html').addClass('android--stock android--stock--' + res[0].split(' ').join('-'));
					}
				}
			}

			// Conditional HTML comments don't work for ie10+ so UA sniff it ...
			detectIE = function() {
				var ua = window.navigator.userAgent,
					msie = ua.indexOf('MSIE ');

				if (msie > 0) {
					// IE 10 or older => return version number
					return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
				}

				var trident = ua.indexOf('Trident/');
				if (trident > 0) {
					// IE 11 => return version number
					var rv = ua.indexOf('rv:');
					return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
				}

				var edge = ua.indexOf('Edge/');
				if (edge > 0) {
					// Edge (IE 12+) => return version number
					return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
				}

				// other browser
				return false;
			};

			var ieVersion = detectIE();

			if (ieVersion !== false) {
				$('html').addClass('ie ie' + ieVersion);

				// let everyone know it's ie10 or greater
				if (ieVersion >= 10) {
					$('html').addClass('gt-ie9');
				}

				// let everyone know it's less than ie11
				if (ieVersion <= 10) {
					$('html').addClass('lt-ie11');
				}
			}


		});
	};
}));
