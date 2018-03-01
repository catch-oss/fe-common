'use strict';

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
         root.catch.conditionalProps = factory(
             root.jQuery,
             root.catch.util
         );
     }

}(this, function ($, util) {

    var handle = function($el, condition, prop, trueVal, falseVal) {
        if (util.testCondition(condition)) $el.prop(prop, trueVal);
        else $el.prop(prop, falseVal);
    };

    return function() {

        $(function() {

            $('[data-prop-condition][data-prop]').each(function() {

                // extract the config
                var $el = $(this),
                    elID = util.elemId($el),
                    condition = $el.attr('data-prop-condition'),
                    prop = $el.attr('data-prop'),
                    trueVal = $el.attr('data-prop-true-val'),
                    falseVal = $el.attr('data-prop-false-val'),
                    bindSelector = $el.attr('data-prop-bind-selector'),
                    bindEvent = $el.attr('data-prop-bind-event'),
                    eName = bindEvent + '.condprop' + elID,
                    eNameDummy = 'dummy' + '.condprop' + elID;

                // do the comparison
                handle($el, condition, prop, trueVal, falseVal);

                // bind event handlers
                $(bindSelector)
                    .off(eName)
                    .off(eNameDummy)
                    .on(eName + ' ' + eNameDummy, function() {
                        handle($el, condition, prop, trueVal, falseVal);
                    });
            });
        });
    };
}));
