;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define(
            [
                'jquery',
                './util'
            ],
            factory
        );

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery'),
            require('./util')
        );

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.summary = factory(
            root.jQuery,
            root.catch.util
        );
    }

} (this, function ($, util, undefined) {

    // the timeout handle
    var t;

    return function(opts) {

        // default
        opts = opts || {};

        // extract some info
        var $el = $('html[data-session-timeout], body[data-session-timeout]'),
            timeout = $el.attr('data-session-timeout') || opts.timeout,
            redirect = $el.attr('data-session-timeout-redirect') || opts.redirect || window.location.href;

        // do we have a timeout?
        if (!timeout || timeout === undefined) return;

        // do we want to clear the timeout
        if (opts.action == 'reset') clearTimeout(t);

        // set the timeout
        t = setTimeout(
            function() {
                window.location = redirect;
            },
            timeout * 1000
        );
    };
}));
