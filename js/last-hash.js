;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define(
            [
                'jquery'
            ],
            factory
        );

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery')
        );

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.lastHash = factory(
            root.jQuery
        );
    }

}(this, function ($, undefined) {

    'use strict';

    return function(opts) {

        opts = opts || {};
        opts.selector = 'a[href*="#"]';

        $(opts.selector)
            .off('hashchange.lastHash')
            .off('click.lastHash')
            .on('click.lastHash hashchange.lastHash', function(e) {
                document.cookie = 'lastHash=' + this.href.split('#')[1] + '; path=/;';
            });
    }
}));
