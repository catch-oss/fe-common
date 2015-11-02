;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.modal = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    return function() {

        $(function() {

            // nav trigger
            $('header .nav-trigger')
                .off('click.nav-trigger')
                .on ('click.nav-trigger',function(e){
                    e.preventDefault();
                    $('#primary-nav').toggleClass('active');
                    $('body').toggleClass('nav-active');
                    $(this).toggleClass('icon-close');
                });

        });
    };
}));
