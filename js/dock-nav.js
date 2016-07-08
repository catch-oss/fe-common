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
            if ($nav.length) {

                // set the default dock point
                var dockPoint = $nav.offsetTop();

                // on scroll...
                $scrollElemPos
                    .off('scroll.dockNav')
                    .on('scroll.dockNav',function(){
                        $nav.toggleClass('docked', $(this).scrollTop() > dockPoint);
                    });

                // on resize...
                $(window)
                    .off('resize.dockNav')
                    .on('resize.dockNav', function() {

                        // is it currently docked
                        var isDocked = $nav.is('.docked');

                        // undock and reset the scroll point
                        $nav.removeClass('docked');
                        dockPoint = $nav.offsetTop();

                        // conditionally redock
                        $nav.toggleClass('docked', isDocked);

                        // trigger scroll
                        $scrollElemPos.trigger('scroll.dockNav');
                    });
            }
        }
    }
}));
