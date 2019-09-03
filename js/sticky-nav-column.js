;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery', './../../body-toucher/body-toucher', './../../dimensionator/dimensionator', './dock-nav'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../../body-toucher/body-toucher'), require('./../../dimensionator/dimensionator'), require('./dock-nav'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.stickyNavColumn = factory(root.jQuery, root.bodyToucher, root.dimensionator, root.catch.dockNav);
    }

}(this, function ($, bodyToucher, dimensionator, dockNav, undefined) {

    'use strict';

    var t = null,
        throttle = function(func, limit) {
            var inThrottle
            return function() {
                var args = arguments;
                var context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(function() {inThrottle = false;}, limit);
                }
            }
        }

    return function(menu, main, column, disableBP) {

        // console.log('bloop');

        $(function() {

            // set a default disable breakpoint
            disableBP = disableBP || 768;

            var $scrollElem = $.scrollElem(),
                init,
                toDesktop;

            if ($(menu).length) {

                init = 0;

                var pad                 = 0,
                    dontStick           = false,
                    normalisingHeight   = false,
                    clearHeight         = dockNav('height') == undefined ? 0 : dockNav('height'),
                    $menu               = $(menu).css({width: $(menu).width(), height: $(menu).height()}),
                    $menuParent         = $menu.parent(),
                    $main               = $(main),
                    $column             = $(column).css({position: 'relative'}),
                    tallestElem         = false,
                    menuTop             = $menuParent.offsetTop() + parseInt($menuParent.css('padding-top')),
                    menuBottom          = menuTop + $menu.innerHeight(),
                    reset               = {
                                            position: '',
                                            top: '',
                                            bottom: ''
                                        },
                    docked              = {
                                            position: 'fixed',
                                            top: clearHeight,
                                            bottom: ''
                                        },
                    dockedBase          = {
                                            position: 'absolute',
                                            bottom: 0,
                                            top: 'auto'
                                        },
                    dockedScreenBottom  = {
                                            position: 'fixed',
                                            bottom: 0,
                                            top: 'auto'
                                        };

                if ($menu.outerHeight(true) > $column.outerHeight(true)) {
                    tallestElem = true;
                }
                if ($(window).dim('w') > (disableBP - 1)) {
                    init = menuTop;
                }
                if ($(window).dim('w') < disableBP) {
                    toDesktop = true;
                }
                var normaliseHeight = function(cb) {

                    // set flag
                    normalisingHeight = true;
                    var sPos = $scrollElem.scrollTop();

                    // console.log('normalising height pre reset ', $main.height(), $column.height(), $scrollElem.scrollTop());

                    $main.css('height', '');
                    $column.css('height', '');

                    // console.log('normalising height post reset ', $main.height(), $column.height(), $scrollElem.scrollTop());

                    var doScrollReset = false,
                        mainHeight = $main.height(),
                        mainOHeight = $main.outerHeight(),
                        colHeight = $column.height(),
                        colOHeight = $column.outerHeight(),
                        menuHeight = $menu.height(),
                        menuOHeight = $menu.height();

                    // something odd happened
                    if (menuOHeight > colOHeight) {
                        
                        // update heights
                        colHeight += menuHeight;
                        colOHeight += menuOHeight;
                    }

                    // just bail here if we dont need to do any sticking
                    if (mainOHeight < colOHeight) {
                        dontStick = true;
                        return;
                    }

                    // carry on as you were...
                    else dontStick = false;

                    // define target height
                    var targetHeight = colHeight;
                    if (mainOHeight > colOHeight) {
                        var targetHeight = mainHeight;
                    }

                    // set target heights
                    if (mainOHeight > colOHeight) $column.height(targetHeight);
                    else $main.height(targetHeight);

                    // set flag
                    normalisingHeight = false;
                    
                    // // this is super dumb
                    // if (doScrollReset && sPos != $scrollElem.scrollTop())
                    //     $scrollElem.scrollTop(sPos);

                    // console.log('normalising height post all ', $main.height(), $column.height(), $scrollElem.scrollTop());

                    // run callback
                    if (typeof cb == 'function') cb();
                };
                var deNormaliseHeight = function() {
                    $main.css('height', '');
                    $column.css('height', '');
                };
                var menuHeight = function() {
                    var maxH = $menu.outerHeight(true);
                    $menu.children().each(function() {
                        var h = $(this).outerHeight(true);
                        if (h > maxH) maxH = h;
                    });
                    return maxH;
                };
                var setHeight = function() {
                    $menu.css('height', menuHeight());
                };
                var removeHeight = function() {
                    $menu.css('height', 'auto');
                };
                var setWidth = function() {
                    var colW = $column.width(),
                        menW = $menu.width(),
                        w = (colW < menW) ? colW : menW;
                    $menu.css('width', w);
                };
                var removeWidth = function() {
                    $menu.css('width', 'auto');
                };
                var unPositionNav = function() {
                    $menu.removeClass('col-docked')
                        .removeClass('col-docked-base')
                        .removeClass('col-docked-screen-bottom')
                        .css(reset);
                };
                var positionNav = function() {

                    // don't stick while normalising height
                    if (normalisingHeight) {
                        setTimeout(positionNav, 10);
                        return;
                    }

                    // reset everything if dont stick is set
                    if (dontStick) {
                        $menu
                            .removeClass('col-docked')
                            .removeClass('col-docked-base')
                            .removeClass('col-docked-screen-bottom')
                            .css(reset);
                        return;
                    }

                    var menuH, scrollPos,
                        scrollThreshBase, scrollThreshScreen,
                        scrollToBase, winH;

                    menuTop             = $menuParent.offsetTop() + parseInt($menuParent.css('padding-top')) - clearHeight;
                    menuH               = menuHeight();
                    menuBottom          = menuTop + menuH;
                    winH                = $(window).dim('h');
                    scrollThreshScreen  = menuTop + clearHeight + (menuH - winH) + pad;
                    scrollToBase        = winH - menuH < 0;
                    scrollPos           = $scrollElem.scrollTop();
                    scrollThreshBase    = winH > menuH
                                            ? ($main.offsetTop() + $main.outerHeight()) - menuH - clearHeight - (pad * 2)
                                            : ($main.offsetTop() + $main.outerHeight()) - winH - (pad * 2);
                    
                    // console.log($scrollElem.scrollTop());

                    if (scrollToBase && (scrollPos > menuTop && scrollPos < scrollThreshScreen)) {

                        // console.log('resetting all docked');

                        $menu.removeClass('col-docked')
                            .removeClass('col-docked-base')
                            .removeClass('col-docked-screen-bottom')
                            .css(reset);

                    }
                    else if (scrollToBase && (scrollPos > menuTop && scrollPos < scrollThreshBase)) {

                        if (scrollPos > scrollThreshScreen) {

                            // console.log('resetting all docked-base');

                            $menu.removeClass('col-docked-base')
                                .addClass('col-docked-screen-bottom')
                                .css(reset)
                                .css(dockedScreenBottom);
                        }

                    }
                    else {

                        $menu.removeClass('col-docked-screen-bottom');

                        // docked top
                        if (!$menu.is('.col-docked') && (menuTop - scrollPos < 0)) {

                            // console.log('adding docked', normalisingHeight, $main.height(), $column.height(), menuTop, scrollPos, menuTop - scrollPos, (menuTop - scrollPos < 0));

                            $menu.addClass('col-docked')
                                .css(reset)
                                .css(docked);

                        } else if ($menu.is('.col-docked') && (menuTop - scrollPos >= 0)) {

                            // console.log('removing docked', normalisingHeight, $main.height(), $column.height(), menuTop, scrollPos, menuTop - scrollPos, (menuTop - scrollPos >= 0));

                            $menu.removeClass('col-docked')
                                .css(reset);

                        }

                        // docked base
                        if ($menu.is('.col-docked') && !$menu.is('.col-docked-base') && scrollPos >= scrollThreshBase) {

                            // console.log('adding docked-base', scrollPos, scrollThreshBase, scrollPos >= scrollThreshBase);

                            $menu.addClass('col-docked-base')
                                .css(reset)
                                .css(dockedBase);

                        } else if ($menu.is('.col-docked-base') && scrollPos < scrollThreshBase) {

                            // console.log('removing docked-base', scrollPos, scrollThreshBase, scrollPos < scrollThreshBase);

                            $menu.removeClass('col-docked-base').css(reset);

                            if ($menu.is('.col-docked')) $menu.css(docked);

                        }
                    }
                };
                var throttledScroller = throttle(function() {
                    if ($(window).dim('w') > (disableBP - 1)) {
                        
                        // console.log('scroll inner', $scrollElem.scrollTop());

                        clearHeight = dockNav('height') == undefined ? 0 : dockNav('height');
                        normaliseHeight(function() {
                            positionNav();
                        });
                    } else {
                        unPositionNav();
                        removeWidth();
                        removeHeight();
                        deNormaliseHeight();
                    }
                }, 100);
                $scrollElem
                    .off('scroll.sticky')
                    .on('scroll.sticky', function() {
                        // console.log('scrollouter', $scrollElem.scrollTop());
                        throttledScroller();
                    });
                $(window)
                    .off('resize.sticky')
                    .on('resize.sticky', function() {
                        if ($(window).dim('w') > (disableBP - 1)) {
                            // console.log('resize');
                            menuBottom = menuTop + $menu.innerHeight();
                            removeWidth();
                            setWidth();
                            removeHeight();
                            setHeight();
                            normaliseHeight(function() {
                                positionNav();
                                if ($(window).dim('w') > (disableBP - 1) && toDesktop) {
                                    init = $menu.offsetTop();
                                    toDesktop = false;
                                }
                            });
                        } else {
                            unPositionNav();
                            removeWidth();
                            removeHeight();
                            deNormaliseHeight();
                        }
                    });
                setTimeout(function(){$(window).trigger('resize');},0);
            }
        });
    };
}));
