;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.modal = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    'use strict';

    return function(conf) {

        conf = conf || {};

        // this is a really weird default, but necessary to not break compatibility
        conf.accordionHeaderSelector = '.accordion-header, .m-accordion-header';

        var hashHandler = function(hash) {

            // defaults
            hash = hash || window.location.hash;

            // the old do nothing trick
            if (!hash || hash.indexOf('/') >= 0) return;

            // vars
            var $el         = $(hash),
                $scrollElem = $.scrollElem(),
                clearHeight = 0;

            // check for the opt out flag
            if ($el.attr('data-hashtrigger') == 'false') return;

            // catch is a reserved word :(
            if (window.catch && window.dockNav) {
                clearHeight = window.catch.dockNav('height');
            }

            if ($el.length) {

                // if we are scrolling to an accordion header / tab then trigger a tap to open it
                var $target = $el;

                while (!$target.is('html')) {

                    // get associated elems for tabs - they should be the same element
                    // however we are allowing for some derpery by the html author
                    var $labelEl = $('#' + $target.attr('aria-labelledby')),
                        $controlsEl = $('[aria-controls="' + $target.attr('id') + '"]');

                    // handle clicks on the element itself or the controller element
                    $labelEl.trigger('tap').trigger('click');

                    // handle derpery by the html author
                    if ($labelEl[0] != $controlsEl[0])
                        $controlsEl.trigger('tap').trigger('click');

                    // Direct accordion refs
                    $target.trigger('tap').trigger('click');

                    // nested accorion refs
                    $target.prev(conf.accordionHeaderSelector).trigger('tap').trigger('click');

                    // look at parent
                    $target = $target.parent();
                }

                if ($scrollElem[0] == window) $scrollElem = $('html, body');

                $scrollElem.animate({ scrollTop: $el.offsetTop() - clearHeight }, 400);
            }
        };

        $(function() {
            $(window)
                .off('hashchange.hashTrigger')
                .on('hashchange.hashTrigger', function(e) {
                    e.preventDefault();
                    hashHandler();
                })
                .off('load.hashTrigger')
                .on('load.hashTrigger', function(e) {
                    hashHandler();
                })
                .trigger('hashchange');

            $("a[href*=\\#]")
                .off('click.hashTrigger')
                .on('click.hashTrigger', function(e) {
                    var link = $(this).attr('href'),
                        hash = link.substr(link.indexOf('#'));

                    if (hash.length > 1 && hash.indexOf('/') === -1) {
                        if ($(hash).length) {
                            e.preventDefault();
                            $(this).blur();
                            hashHandler(hash);
                        }
                    }
                });
        });

    };
}));
