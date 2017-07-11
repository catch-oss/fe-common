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
        root.twoDegrees = (root.twoDegrees || {});
        root.catch.tooltip = factory(
            root.jQuery
        );
    }

} (this, function ($, undefined) {

    return function(conf) {

        $(function() {

            // defaults
            conf = conf || {};

            if (conf.triggerSelector === undefined)
                conf.triggerSelector= '.js-tooltip-trigger';

            if (conf.contentSelector === undefined)
                conf.contentSelector= '.js-tooltip-content';

            if (conf.offset === undefined)
                conf.offset = {x: 20, y: 20};

            // init the floaters
            $(conf.triggerSelector).each(function() {

                var $this = $(this),
                    tooltipSelector = $this.attr('data-tooltip-selector'),
                    $tooltip = tooltipSelector !== undefined
                        ? $(tooltipSelector)
                        : $this.next(conf.contentSelector);

                $this
                    .on('mouseenter', function() {
                        $tooltip.addClass('s-tooltip-active');
                    })
                    .on('mouseleave', function() {
                        $tooltip.removeClass('s-tooltip-active');
                    })
                    .on('mousemove', function(e) {
                        $tooltip.css({
                            position: 'fixed',
                            left: e.pageX + conf.offset.x,
                            top: e.pageY + conf.offset.y
                        });
                    });
            });
        });
    };
}));
