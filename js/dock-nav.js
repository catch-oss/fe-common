;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery', './../../body-toucher/body-toucher'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../../body-toucher/body-toucher'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.dockNav = factory(root.jQuery);
    }

}(this, function ($, bodyToucher, undefined) {

    return function(options) {

        var $nav = $('.dockable-nav-container'),
            $scrollElemPos = $.scrollElem();

        if (options == 'height') {
            return $nav.outerHeight(true);
        }
        else {

            // handle nav
            if($nav.length){

                var dockPoint = $nav.offsetTop();

                $scrollElemPos
                .off('scroll.dockNav')
                .on('scroll.dockNav',function(){

                    var scroll = $(this).scrollTop();
                    $nav.toggleClass('docked', scroll > dockPoint);

                });
            }
        }
    }
}));
