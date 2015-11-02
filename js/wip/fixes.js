// DEPRECATED
// need to go through and remove all references to twoDegrees.addBody
;(function($) {

    "use strict";

    $(function(){


        // body Toucher

        twoDegrees.addBody = function() {
            $.addBody();
        }

        twoDegrees.removeBody = function() {
            $.removeBody();
        }
        
        // ------------------------------------------------------
        // handle some weirdness with number inputs
        // number inputs return no value unless it's a valid number
        // ------------------------------------------------------

        twoDegrees.restrictNumberInputs = function() {

            $('input[type="number"]').on('keydown', function(e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                     // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                     // Allow: home, end, left, right, down, up
                    (e.keyCode >= 35 && e.keyCode <= 40)) {
                         // let it happen, don't do anything
                         return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
        };

        // ------------------------------------------------------
        // scale 100% to be 100% of window minus scrollbar
        // ------------------------------------------------------

        twoDegrees.fullWidthFix = function(elemSelector, containerSelector) {

            elemSelector = elemSelector || '.full-width';
            containerSelector = containerSelector || window;

            $(window).on('resize', function() {

                var $c = $(containerSelector),
                    $e = $(elemSelector).width('100%'),
                    rW = $c.dim('w'),
                    w = $e.width(),
                    diff = rW - w,
                    off = (diff / 2) * -1;

                $(elemSelector)
                    .css({position: 'relative', left: off})
                    .width(rW);

            }).trigger('resize');
        }

        twoDegrees.iFrameFix = function() {
            $('iframe[data-src]').each(function(idx) {
                if (!$(this).attr('src')) {
                    $(this).attr('src', $(this).attr('data-src'));
                }
            });
        }

        // ------------------------------------------------------
        // native javascript bindings
        // ------------------------------------------------------

        twoDegrees.handler = {
            bind:function(el, ev, fn){
                if(window.addEventListener){ // modern browsers including IE9+
                    el.addEventListener(ev, fn, false);
                } else if(window.attachEvent) { // IE8 and below
                    el.attachEvent('on' + ev, fn);
                } else {
                    el['on' + ev] = fn;
                }
            },

            unbind:function(el, ev, fn){
                if(window.removeEventListener){
                    el.removeEventListener(ev, fn, false);
                } else if(window.detachEvent) {
                    el.detachEvent('on' + ev, fn);
                } else {
                    elem['on' + ev] = null;
                }
            },

            stop:function(ev) {
                var e = ev || window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
            }
        }

    });

})(jQuery);
