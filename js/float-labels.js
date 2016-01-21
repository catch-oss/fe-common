
 ;(function (root, factory) {

     // AMD. Register as an anonymous module depending on jQuery.
     if (typeof define === 'function' && define.amd) define(['jquery', './../../labelizr/labelizr'], factory);

     // Node, CommonJS-like
     else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../../labelizr/labelizr'));

     // Browser globals (root is window)
     else {
         root.catch = (root.catch || {});
         root.catch.floatLabels = factory(root.jQuery);
     }

}(this, function ($, undefined) {

    'use strict';

    return function(selector) {

        selector = selector || 'input:not(.no-label), select:not(.no-label), textarea:not(.no-label)';

        $(function() {
            $(selector).labelizr({classSwitchOnly: true});
        });

    };

}));
