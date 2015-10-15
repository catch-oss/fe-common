;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery', './../../dropasaurus/dropasaurus', './../../dropasaurus/simple-dropdown'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../../dropasaurus/dropasaurus'), require('./../../dropasaurus/simple-dropdown'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.dropDowns = factory(root.jQuery);
    }

}(this, function ($, dropasaurus, simpleDD, undefined) {

    return {
        formSelect: function(selector, options, params) {
            $(function(){
                if (typeof selector == 'undefined') selector = 'select.catch-dropdown';
                $(selector).catchDropdown(options, params);
            });
        },
        simpleDropdown: function(selector, options, params) {
            $(function(){
                if (typeof selector == 'undefined') selector = '.simple-dd';
                $(selector).simpleDropdown(options, params);
            });
        },
        dropDowns: function() {
            twoDegrees.formSelect();
            twoDegrees.simpleDropdown();
        }
    };

}));
