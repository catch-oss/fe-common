;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.accordions = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    return function() {
        $(function() {
            $('.c-alert__close')
                .off('click.alert')
                .on('click.alert', function(e) {
                    e.preventDefault();
                    $(this).closest('.c-alert').remove();
                });
        });
    }
}))
