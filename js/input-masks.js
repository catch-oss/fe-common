;(function (root, factory) {

     // AMD. Register as an anonymous module depending on jQuery.
     if (typeof define === 'function' && define.amd) define(['jquery', './../../jquery-mask-plugin/index'], factory);

     // Node, CommonJS-like
     else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../../jquery-mask-plugin/index'));

     // Browser globals (root is window)
     else {
         root.catch = (root.catch || {});
         root.catch.inputMasks = factory(root.jQuery);
     }

}(this, function ($, undefined) {

    'use strict';

    return function() {

        $(function() {

            // mobile mask
            $('.mask-mobile-number').mask('(000) 000 00099');

        });

    };

}));
