;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define([], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory();

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.util = factory();
    }

}(this, function ($, undefined) {

    'use strict';

    return {
        uuid: function() {
            let d = new Date().getTime(),
                uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    let r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            return uuid;
        }
    }
}))
