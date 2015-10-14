define([
    'jquery',
    'app/scope',
    'masterlib/scope'
], function($, app, twoDegrees) {

    'use strict';

    return function(menu, main, column, disableBP) {

        // set a default disable breakpoint
        disableBP = disableBP || 'md';

        var $scrollElem = $.scrollElem(),
            init,
            toDesktop;

        if ($(menu).length && !Modernizr.touch) {

            init = 0;

            var pad                 = 0,
                clearHeight         = twoDegrees.dockNav('height'),
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
            if ($(window).dim('w') > (app.config.get('breakPoints.md') - 1)) {
                init = menuTop;
            }
            if ($(window).dim('w') < app.config.get('breakPoints.md')) {
                toDesktop = true;
            }
            var normaliseHeight = function() {
                $main.css('height', '');
                $column.css('height', '');
                if ($main.outerHeight() > $column.outerHeight()) {
                    $column.height($main.height());
                }
                else {
                    $main.height($column.height());
                }
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

                if (scrollToBase && (scrollPos > menuTop && scrollPos < scrollThreshScreen)) {

                    $menu.removeClass('col-docked')
                         .removeClass('col-docked-base')
                         .removeClass('col-docked-screen-bottom')
                         .css(reset);

                }
                else if (scrollToBase && (scrollPos > menuTop && scrollPos < scrollThreshBase)) {

                    if (scrollPos > scrollThreshScreen) {
                        $menu.removeClass('col-docked-base')
                             .addClass('col-docked-screen-bottom')
                             .css(reset)
                             .css(dockedScreenBottom);
                    }

                }
                else {

                    $menu.removeClass('col-docked-screen-bottom');

                    if (!$menu.is('.col-docked') && (menuTop - scrollPos < 0)) {

                        $menu.addClass('col-docked')
                             .css(reset)
                             .css(docked);

                    } else if ($menu.is('.col-docked') && (menuTop - scrollPos >= 0)) {

                        $menu.removeClass('col-docked')
                             .css(reset);

                    }
                    if ($menu.is('.col-docked') && !$menu.is('.col-docked-base') && scrollPos >= scrollThreshBase) {

                        $menu.addClass('col-docked-base')
                             .css(reset)
                             .css(dockedBase);

                    } else if ($menu.is('.col-docked') && $menu.is('.col-docked-base') && scrollPos < scrollThreshBase) {

                        $menu.removeClass('col-docked-base')
                             .css(reset)
                             .css(docked);

                    }
                }
            };
            $scrollElem
                .off('scroll.sticky')
                .on('scroll.sticky', function() {
                    if ($(window).dim('w') > (app.config.get('breakPoints.' + disableBP) - 1)) {
                        clearHeight = twoDegrees.dockNav('height');
                        positionNav();
                        normaliseHeight();
                    } else {
                        unPositionNav();
                        removeWidth();
                        removeHeight();
                        deNormaliseHeight();
                    }
                });
            $(window)
                .off('resize.sticky')
                .on('resize.sticky', function() {
                    if ($(window).dim('w') > (app.config.get('breakPoints.' + disableBP) - 1)) {
                        menuBottom = menuTop + $menu.innerHeight();
                        removeWidth();
                        setWidth();
                        removeHeight();
                        setHeight();
                        normaliseHeight();
                        positionNav();
                        if ($(window).dim('w') > (app.config.get('breakPoints.md') - 1) && toDesktop) {
                            init = $menu.offsetTop();
                            toDesktop = false;
                        }
                    } else {
                        unPositionNav();
                        removeWidth();
                        removeHeight();
                        deNormaliseHeight();
                    }
                });
            setTimeout(function(){$(window).trigger('resize');},0);
        }
    };
});
