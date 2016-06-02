;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery', './../../slidatron/slidatron', './sniff-ua'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../../slidatron/slidatron'), require('./sniff-ua'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.carousel = factory(root.jQuery);
    }

}(this, function ($, slidatron, sniffUA) {

	'use strict';

    return function(conf) {

        // opts
        var opts = typeof conf == 'object' ? conf : {};

        // backwards compatible...
        if (typeof conf == 'string') opts.selector = conf;

    	$(function() {

            // do the UA sniffing
            sniffUA();

            // default selector
            opts.selector = opts.selector || '.cta-multi.cta-carousel .cta-wrapper, .carousel-wrapper';

            // iterate through the els that match the selector
            $(opts.selector).each(function() {

                // set some vars
                var $this = $(this),
                    drag = $this.is('.no-drag *') ? false : 'touch',
                    allowDefault = false,
                    translateY = $('html').is('.android--stock'); // use translateY on android stock - see below

                // we only allowDefault on the header carousel on old android
                // so as the user can scroll through it,
                // allowing default triggers scroll and breaks touchmove on the stock android browser
                if (!$('html').is('.android--stock') || $this.is('header *')) {
                    allowDefault = true;
                    translateY = false;
                }

                $this.slidatron(
                    $.extend(
                        {},
                        {
                            classNameSpace  : 'slider',
                            adaptiveHeight  : true,
                            translateY      : translateY,
                            transition      : $this.is('.transition-slide') ? 'left' : 'opacity',
                            drag            : drag,
                            allowDefault    : allowDefault,
                            autoSlide       : $this.is('.auto-slide *'),
                            cursor          : '',
                            onAfterInit     : function($elem, tron) {
                                $elem
                                .off('click.showStopper')
                                .on('click.showStopper', function() {
                                    tron.stopShow();
                                })
                                .find('.video-play')
                                    .off('click.showStopper')
                                    .on('click.showStopper', function() {
                                        tron.stopShow();
                                    })
                                    .end()
                                .find('.video-close')
                                    .off('click.showStopper')
                                    .on('click.showStopper', function() {
                                        tron.startShow();
                                    })

                            }
                        },
                        opts
                    )
                );

            });
    	});
    };
}));
