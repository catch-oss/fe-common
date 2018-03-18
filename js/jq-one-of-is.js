'use strict';

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
        root.catch.jqOneOfIs = factory(
            root.jQuery
        );
    }

}(this, function($) {

   "use strict"

   $(function() {

        $.fn.oneOfIs = function(selector) {

            var rVal = false;

            this.each(function() {
                if ($(this).is(selector)) rVal = true;
            });

            return rVal;

        };

        $.fn.noneOfAre = function(selector) {

            var rVal = true;

            this.each(function() {
                if ($(this).is(selector)) rVal = false;
            });

            return rVal;

        };
    });
}));
