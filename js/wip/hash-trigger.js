;(function($) {

    "use strict";

    $(function(){

        var hashHandler = function(hash) {

            hash        = hash || window.location.hash;

            if(!hash || hash.indexOf('/')>=0)
                return;

            var $el         = $(hash),
                $scrollElem = $.scrollElem(),
                clearHeight = twoDegrees.dockNav('height');

            if ($el.length) {

                $scrollElem.animate({ scrollTop: $el.offsetTop() - clearHeight }, 400);

                // if we are scrolling to an accordion header trigger a tap to open it
                if (!$el.is('.active')) $el.trigger('tap').trigger('click');
            }
        };

        var cleanUrl = function(url) {

            // remove domain if there
            url = url.replace(/https?:\/\/[^\/]+/i, '');
            // remove hash
            url = url.split('#');
            // remove leading and trailing slashes
            return url[0].replace(/^\/+|\/+$/gm,'');
        };

        twoDegrees.hashTrigger = function() {
            $(window).off('hashchange.hashTrigger').on('hashchange.hashTrigger', function(e) {
                e.preventDefault();
                hashHandler();
            }).off('load.hashTrigger').on('load.hashTrigger', function(e) {
                hashHandler();
            }).trigger('hashchange');

            $("a[href*=#]").off('tap.hashTrigger').on('tap.hashTrigger', function(e) {

                if ($($(this).attr('href')).length) {

                    if (cleanUrl(window.location.pathname) === cleanUrl($(this).attr('href'))) {
                        e.preventDefault();
                        hashHandler($(this).attr('href'));
                    }
                }
            });
        };

    });

})(jQuery);
