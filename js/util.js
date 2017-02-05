;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.util = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    'use strict';

    return {
        uuid: function() {
            var d = new Date().getTime(),
                uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            return uuid;
        },
        elemId: function($elem, idBase) {

            var elementID = $elem.attr('id'),
                idBase = idBase || $elem.text().replace(/[^A-Za-z0-9]+/g, '-').replace('--', '-').replace(/(^-|-$)/, '').toLowerCase(),
                i = 2;

            if (!elementID) {
                elementID = idBase;
                while (!elementID || $('#' + elementID).length) {
                    elementID = idBase + '-' + i;
                    i++;
                }
                $elem.attr('id', elementID);
            }
            return elementID;
        },
    }
}))
