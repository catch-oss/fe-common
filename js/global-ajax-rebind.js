;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.globalAjaxRebind = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    'use strict';

    return function(conf) {

        conf = conf || {};
        conf.selector = conf.selector || '.js-global-ajax-rebind';

        if ($(conf.selector).length) {

            $(document).ajaxSuccess(function(e, xhr, settings) {

                if (typeof conf.cb == 'function') {
                    conf.cb(e, xhr, settings);
                }
            });
        }
    };
}));
