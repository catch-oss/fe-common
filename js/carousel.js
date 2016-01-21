;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery', './../../slidatron/slidatron', './../../jquery.event.drag-drop/index'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../../slidatron/slidatron'), require('./../../jquery.event.drag-drop/index'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.carousel = factory(root.jQuery);
    }

}(this, function ($) {

	'use strict';

    return function(selector) {

    	$(function() {

            selector = selector || '.cta-multi.cta-carousel .cta-wrapper';

            $(selector).each(function() {

                var $this = $(this),
                    drag = $this.is('.no-drag *') ? false : 'touch';

                $this.slidatron({
                    classNameSpace  : "slider",
                    adaptiveHeight  : true,
                    translateY      : true,
                    transition      : 'opacity',
                    drag            : drag,
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
                });

            });
    	});
    };
}));
