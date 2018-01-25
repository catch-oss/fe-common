;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery', './dock-nav'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./dock-nav'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.hashTrigger = factory(
            root.jQuery,
            root.catch.dockNav
        );
    }

}(this, function ($, dockNav) {

    'use strict';

    return function() {

        var hashHandler = function(hash) {

            // defaults
            hash = hash || window.location.hash;

            // the old do nothing trick
            if (!hash || hash.indexOf('/') >= 0) return;

            // vars
            var $el         = $(hash),
                $scrollElem = $.scrollElem(true),
                clearHeight = 0;

            // catch is a reserved word :(
            if ($('.dockable-nav-container').length) {
                clearHeight = dockNav('height');
            }

            if ($el.length) {

                $scrollElem.animate({ scrollTop: $el.offsetTop() - clearHeight }, 400);

                // if we are scrolling to an accordion header trigger a tap to open it
                if (!$el.is('.active')) $el.trigger('tap').trigger('click');
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

                    if ($(hash).length) {
                        e.preventDefault();
                        hashHandler(hash);
                    }
                });

        });
    };
}));
