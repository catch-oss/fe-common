;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.postMessageServer = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    'use strict';

    return function(opts) {

        // default to an empty obj
        opts = opts || {};

        // default the elem to an array (ala jQuery)
        opts.postBackWin = opts.postBackWin || [];

        // window reference
        var postBackWin = opts.postBackWin[0] || window.parent;

        // run after dom ready
        $(function() {

            $(window)
                .off('message:pms')
                .on('message:pms', function(e) {

                    var req = JSON.parse(e.data),
                        res = {req: req, res: {}};

                    console.log(req);

                    // parent window queries
                    // -> we have something to post back to here
                    // -----------------------------------------

                    if (req.query == 'document.height') {
                        res.res.height = $(document).height();
                        postBackWin.postMessage(JSON.stringify(res));
                    }

                    if (req.query == 'window.location') {
                        res.res.location = window.location;
                        postBackWin.postMessage(JSON.stringify(res));
                    }

                    // child window queries
                    // ----------------------------------

                    if (req.query == 'link.click') {

                        // does the link contain a #
                        var hasHash = req.link.indexOf('#') >= 0,
                            hasHistory = history.replaceState !== undefined;

                        // do the postback before attempting the other things
                        // as it can create a reload
                        if (postBackWin !== undefined) {
                            res.res.hasHash = hasHash;
                            res.res.hasHistory = hasHistory;
                            postBackWin.postMessage(JSON.stringify(res));
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
                });
        });
    };
}));
