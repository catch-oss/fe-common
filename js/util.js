;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.util = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    'use strict';

    return {

        uuid: function() {
            var d = new Date().getTime(),
                uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            return uuid;
        },

        elemId: function($elem, idBase) {

            var elementID = $elem.attr('id'),
                idBase = idBase || $elem.text().replace(/[^A-Za-z0-9]+/g, '-').replace('--', '-').replace(/(^-|-$)/, '').toLowerCase(),
                i = 2;

            if (!elementID) {
                elementID = idBase;
                while (!elementID || $('#' + elementID).length) {
                    elementID = idBase + '-' + i;
                    i++;
                }
                $elem.attr('id', elementID);
            }
            return elementID;
        },

        testCondition: function(requirement) {
            var a = typeof requirement == 'string' ? this.parseCSV(requirement) : requirement,
                opPattern = /[\-\+=\*\/%<>&\|\^]/,
                required = '',
                join,
                compareTo,
                i,
                iBase,
                iSelector,
                iComparison,
                iValue,
                iConditionJoin,
                operator;

            for (i=0; i < Math.ceil(a.length / 4); i++) {
                iBase = (i * 4);
                iConditionJoin = iBase - 1;
                iSelector = iBase;
                iComparison = iBase + 1;
                iValue = iBase + 2;
                join = typeof a[iConditionJoin] == 'undefined' ? '' :  a[iConditionJoin];
                compareTo = a[iValue].trim(),
                operator = a[iComparison].trim();

                // check the value to see if it's a special case otherwise wrap it in quotes so it gets treated as a string
                // this is a little bit of a hack because we are using this csv parser which strips the quotes
                if (compareTo != 'false' && compareTo != 'true' && compareTo != 'null' && !/^[0-9]+$/.test(compareTo))
                    compareTo = "'" + compareTo + "'";

                // if it's not a standard boolean operator then assume its a function call
                if (opPattern.test(operator)) {

                    // append to the conditional string
                    required += join + " $('" + a[iSelector].trim() + "').val() " + operator + " " + compareTo;
                }
                else {

                    // append to the conditional string
                    required += join + " $('" + a[iSelector].trim() + "')." + operator + "(" + compareTo + ") ";
                }
            }

            // evaluate the conditional
            return eval(required);
        },

        parseCSV: function(text) {
            var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
            var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
            // Return NULL if input string is not well formed CSV string.
            if (!re_valid.test(text)) return null;
            var a = [];                     // Initialize array to receive values.
            text.replace(re_value, // "Walk" the string using replace with callback.
                function(m0, m1, m2, m3) {
                    // Remove backslash from \' in single quoted values.
                    if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                    // Remove backslash from \" in double quoted values.
                    else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                    else if (m3 !== undefined) a.push(m3);
                    return ''; // Return empty string.
                });
            // Handle special case of empty last value.
            if (/,\s*$/.test(text)) a.push('');
            return a;
        },

        ev: {

            bind:function(el, ev, fn){
                if (window.addEventListener) { // modern browsers including IE9+
                    el.addEventListener(ev, fn, false);
                } else if(window.attachEvent) { // IE8 and below
                    el.attachEvent('on' + ev, fn);
                } else {
                    el['on' + ev] = fn;
                }
                return this;
            },

            unbind:function(el, ev, fn){
                if (window.removeEventListener) {
                    el.removeEventListener(ev, fn, false);
                } else if(window.detachEvent) {
                    el.detachEvent('on' + ev, fn);
                } else {
                    elem['on' + ev] = null;
                }
                return this;
            },

            stop:function(ev) {
                var e = ev || window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                return this;
            },

            fire: function(element, name) {

                var e = null;

                if (document.createEventObject) {
                    e = document.createEventObject();
                    element.fireEvent('on' + name, e);
                }
                else {
                    e = document.createEvent('HTMLEvents');
                    e.initEvent(name, true, true);
                    element.dispatchEvent(e);
                }

                return this;
            }
        }
    }
}))
