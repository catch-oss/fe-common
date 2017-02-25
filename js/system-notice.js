;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define(
            [
                'jquery',
                './util'
            ],
            factory
        );

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery'),
            require('./util')
        );

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.systemNotice = factory(
            root.jQuery,
            root.catch.util
        );
    }

} (this, function ($, util) {

    return function(opts) {

        opts = opts || {};

        var noticeSelector = opts.noticeSelector || '.m-notice__notice',
            closeSelector = opts.closeSelector || '.m-notice__notice__close',
            activeClass = opts.activeClass || 's-active',
            htmlActiveClass = opts.htmlActiveClass || 's-notice-active',
            cookieName = opts.cookieName || 'seenNotice';

        $(function() {
            $(noticeSelector).each(function() {

                var $notice = $(this),
                    elid = util.elemId($notice),
                    cName = cookieName + '-' + elid;
                    cookie = util.getCookie(cName);

                console.log(cName, cookie);

                if (!cookie) {
                    $notice.addClass(activeClass);
                    $('html').addClass(htmlActiveClass);
                }

                $(closeSelector).off('click.notice').on('click.notice',function(e) {

                    e.preventDefault();

                    var $notice = $(this).closest(noticeSelector),
                        elid = util.elemId($notice),
                        cName = cookieName + '-' + elid;

                    $notice.removeClass(activeClass);
                    util.setCookie(cName, true);

                    if (!$(noticeSelector + '.' + activeClass).length)
                        $('html').removeClass(htmlActiveClass);

                    // forces dd to recalc y offset
                    $(window).trigger('resize');
                });
            });
        });
    };
}));
