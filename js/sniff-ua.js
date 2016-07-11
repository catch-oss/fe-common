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

            // Conditional HTML comments don't work for ie10+ so UA sniff it ...
            var getInternetExplorerVersion = function() {

                var rv = -1;

                if (navigator.appName == 'Microsoft Internet Explorer'){
                    var ua = navigator.userAgent;
                    var re  = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');

                    if (re.exec(ua) !== null) {
                        rv = parseFloat( RegExp.$1 );
                    }
                }

                else if (navigator.appName == 'Netscape'){
                    var ua = navigator.userAgent;
                    var re  = new RegExp('Trident/.*rv:([0-9]{1,}[\.0-9]{0,})');

                    if (re.exec(ua) !== null) {
                        rv = parseFloat( RegExp.$1 );
                    }
                }

                return rv;
            };

            // let everyone know it's ie10 or greater
            if (getInternetExplorerVersion() >= 10){
                $('html').addClass('ie gt-ie9');
            }
		});
	};
}));
