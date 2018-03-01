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
        root.catch.conditionalClasses = factory(
            root.jQuery,
            root.catch.util
        );
    }

}(this, function ($, util) {

    var handle = function($el, condition, classes) {
        if (util.testCondition(condition)) $el.addClass(classes);
        else $el.removeClass(classes);
    };

    return function() {

        $(function() {

            $('[data-condition][data-class]').each(function() {

                // extract the config
                var $el = $(this),
                    elID = util.elemId($el),
                    condition = $el.attr('data-condition'),
                    classes = $el.attr('data-class'),
                    bindSelector = $el.attr('data-bind-selector'),
                    bindEvent = $el.attr('data-bind-event'),
                    eName = bindEvent + '.condclass' + elID,
                    eNameDummy = 'dummy' + '.condclass' + elID;

                // do the comparison
                handle($el, condition, classes);

                // bind event handlers
                $(bindSelector)
                    .off(eName)
                    .off(eNameDummy)
                    .on(eName + ' ' + eNameDummy, function() {
                        handle($el, condition, classes);
                    });
            });
        });
    };
}));
