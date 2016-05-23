;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.nav = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    'use strict';

    return function(conf) {

        conf = conf || {};
        conf.triggerSelector = conf.triggerSelector || 'header .nav-trigger';
        conf.navSelector = conf.navSelector || '#primary-nav';
        conf.navActiveClass = conf.navActiveClass || 'active';
        conf.documentActiveClass = conf.documentActiveClass || 'nav-active';
        conf.triggerActiveClass = conf.triggerActiveClass || 'icon-close';

        $(function() {

            // nav trigger
            $(conf.triggerSelector)
                .off('click.nav-trigger')
                .on('click.nav-trigger', function(e) {
                    e.preventDefault();
                    var isActive = $(this).is('.' + conf.triggerActiveClass);
                    $(conf.navSelector).toggleClass(conf.navActiveClass, !isActive);
                    $('body').toggleClass(conf.documentActiveClass, !isActive);
                    $(this).toggleClass(conf.triggerActiveClass, !isActive);
                });

        });
    };
}));
