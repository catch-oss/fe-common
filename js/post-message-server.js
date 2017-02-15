;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define([
            'jquery',
            './util'
        ], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery'),
            require('./util')
        );

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.postMessageServer = factory(
            root.jQuery,
            root.catch.util
        );
    }

}(this, function ($, util, undefined) {

    'use strict';

    return function(opts) {

        // default to an empty obj
        opts = opts || {};

        // run after dom ready
        $(function() {

            var handler = function(e) {

                try {

                    var req = JSON.parse(e.data),
                        res = {req: req, res: {}};

                    // parent window queries
                    // -> we have something to post back to here
                    // -----------------------------------------

                    if (req.query == 'document.height') {
                        res.res.height = $(document).height();
                        e.source.postMessage(JSON.stringify(res));
                    }

                    if (req.query == 'window.location') {
                        res.res.location = window.location;
                        e.source.postMessage(JSON.stringify(res));
                    }

                    // child window queries
                    // ----------------------------------

                    if (req.query == 'link.click') {

                        // does the link contain a #
                        var hasHash = req.link.indexOf('#') >= 0,
                            hasHistory = history.replaceState !== undefined;

                        // do the postback before attempting the other things
                        // as it can create a reload
                        if (e.source !== undefined) {
                            res.res.hasHash = hasHash;
                            res.res.hasHistory = hasHistory;
                            e.source.postMessage(JSON.stringify(res), e.origin);
                        }

                        // if it's just a link then follow it
                        if (!hasHash)
                            window.location = req.link;

                        // if it has a hash but we don't have history
                        // atm this is basically a dupe of !hasHash, but we'll
                        // leave it seperate for the time being
                        // in case we figure out a work around
                        else if (hasHash && !hasHistory)
                            window.location = req.link;

                        // the ideal scenario
                        else if (hasHash && hasHistory) {
                            history.replaceState({}, document.title, req.link);
                            $(window).trigger('hashchange');
                        }
                    }
                }

                catch (e) {
                    // silently fail - most likely this message was not for us
                    // console.error(e);
                }
            };

            // bind event handlers
            util.ev
                .unbind(window, 'message', handler)
                .bind(window, 'message', handler);
        });
    };
}));
