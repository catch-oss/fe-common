;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.accordion = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    return function() {

        $('.accordion-header')
            .off('click.accordion')
            .on('click.accordion',function(e){
                e.preventDefault();
                $(this).toggleClass("active");
            });
    }

}))
