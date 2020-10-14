;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery', './../../droposaurus/droposaurus', './../../droposaurus/simple-dropdown'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../../droposaurus/droposaurus'), require('./../../droposaurus/simple-dropdown'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.dropDowns = factory(root.jQuery);
    }

}(this, function ($, droposaurus, simpleDD, undefined) {

    // cached has touch lookup
    var hasTouchCache = null,
        hasTouch = function() {

            // return the cached lookup
            if (hasTouchCache === null) {

                // do the lookup
                try {
                    document.createEvent("TouchEvent");
                    hasTouchCache = true;
                } catch (e) {
                    hasTouchCache = false;
                }
            }

            return hasTouchCache;
        };

    return {
        formSelect: function(selector, options, params) {

            options = options || {};
            options.baseClass = options.baseClass || 'm-dropdown';

            $(function(){

                // default selectors
                if (typeof selector == 'undefined' || !selector)
                    selector = 'select.catch-dropdown, .' + options.baseClass + '__select';

                // are we going to use droposarus on mobile?
                if (options !== undefined && options.useBrowserSelectOnTouch && hasTouch()) {

                    $(selector).each(function() {
                        if (!$(this).hasClass('s-has-touch')) {
                            $(this).addClass('s-has-touch')
                                .wrap('<span class="s-has-touch ' + options.baseClass + '__inner" />')
                                .closest('.' + options.baseClass + '')
                                    .addClass('s-has-touch');
                        }
                    });

                }

                else $(selector).catchDropdown(options, params);
            });
        },
        simpleDropdown: function(selector, options, params) {
            $(function(){
                if (typeof selector == 'undefined') selector = '.simple-dd';
                $(selector).simpleDropdown(options, params);
            });
        },
        dropDowns: function(selector, options, params) {
            this.formSelect(selector, options, params);
            this.simpleDropdown(selector, options, params);
        }
    };

}));
