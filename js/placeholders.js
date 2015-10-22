;(function (root, factory) {

     // AMD. Register as an anonymous module depending on jQuery.
     if (typeof define === 'function' && define.amd) define(['jquery', './../../polyholder/polyholder'], factory);

     // Node, CommonJS-like
     else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../../polyholder/polyholder'));

     // Browser globals (root is window)
     else {
         root.catch = (root.catch || {});
         root.catch.placeholders = factory(root.jQuery);
     }

}(this, function ($, undefined) {

    'use strict';

    return function() {

        $(function() {
            $('input, textarea').placeholder();
        });

    };

}));
