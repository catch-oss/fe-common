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
        root.catch = (root.catch || {});
        root.twoDegrees = (root.twoDegrees || {});
        root.twoDegrees.placeholder = factory(
            root.jQuery
        );
    }

}(this, function($, SniffUA) {

    'use strict';

    // shim only works for cover as of now
    return function(selector) {

        $(function() {

            var $html = $('html');

            // default
            selector = selector || '.js-object-fit-shim';

            // skip non IE browsers - object fit doesn't work for video in any edge
            if (!$html.hasClass('ie')) {
                return;
            }

            // Modified https://codepen.io/arniebradfo/pen/eFtdf?editors=0010
            var coverFillSwitch = function(container, img) {

                if (!container || !img) return false;

                var imgHeight = img.naturalHeight || img.videoHeight;
                var imgWidth = img.naturalWidth || img.videoWidth;
                var containerRatio = container.offsetWidth / container.offsetHeight;
                var imgRatio = imgWidth / imgHeight;

                var ratioComparison = false;
                if (imgRatio >= containerRatio) ratioComparison = true;

                if (ratioComparison) {
                    img.style.height = '100%';
                    img.style.width = 'auto';
                } else {
                    img.style.height = 'auto';
                    img.style.width = '100%';
                }

            },

            applyStandardProperties = function(container, img) {

                var containerStyle = window.getComputedStyle(container);
                if (containerStyle.overflow !== 'hidden') container.style.overflow = 'hidden';
                if (containerStyle.position !== 'relative' &&
                  containerStyle.position !== 'absolute' &&
                  containerStyle.position !== 'fixed') container.style.position = 'relative';
                img.style.position = 'absolute';
                img.style.top = '50%';
                img.style.left = '50%';
                img.style.transform = 'translate(-50%,-50%)';
            },

            objectFitInt = function() {

                var imgs = $(selector).each(function() {
                    var $container = $(this),
                        img = $container.children()[0];
                    coverFillSwitch(this, img);
                    applyStandardProperties(this, img);
                });
            },

            objectFitResize = function() {
                var imgs = $(selector).each(function() {
                    var $container = $(this),
                        img = $container.children()[0];
                    coverFillSwitch(this, img);
                });
            },

            resizeTimeout,

            resizeThrottler = function() { // @source https://developer.mozilla.org/en-US/docs/Web/Events/resize
                if (!resizeTimeout) {
                    resizeTimeout = setTimeout(function() {
                        resizeTimeout = null;
                        objectFitResize();
                    }, 66); // The objectFitResize will execute at a rate of 15fps
                }
            }

            objectFitInt();
            resizeThrottler();

        });
    };
}));
