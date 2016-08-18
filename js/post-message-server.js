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

    return function() {
        $(function() {
            $(window)
                .off('message:pms')
                .on('message:pms', function(e) {

                    var req = JSON.parse(e.data),
                        res = {req: req, res: {}};

                    if (req.query == 'document.height') {
                        res.res.height = $(document).height();
                        window.parent.postMessage(JSON.stringify(res));
                    }

                    if (req.query == 'window.location') {
                        res.res.location = window.location;
                        window.parent.postMessage(JSON.stringify(res));
                    }
                });
        });
    };
}));
