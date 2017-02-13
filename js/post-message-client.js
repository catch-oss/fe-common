;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define([
            'jquery',
            './util'
        ], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery'),
            require('./util')
        );

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.postMessageClient = factory(
            root.jQuery,
            root.catch.util
        );
    }

}(this, function ($, undefined) {

    'use strict';

    var cbRegister = {},
        guid = function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
                .replace(/[xy]/g, function(c) {
                    var r = Math.floor(Math.random() * 16),
                        v = c === 'x' ? r : (r % 4 + 4);
                    return v.toString(16);
                });
        };

    return function($el, query, cb, origin) {

        $(function() {

            // set up the listener
            var handler = function(e) {

                // parse the response
                var data = JSON.parse(e.data);

                // did we send this message?
                if (typeof data.req == 'undefined') return;

                // find the callback
                if (typeof cbRegister[data.req.id] == 'function') {

                    // fire the callback
                    cbRegister[data.id](data);
                    delete(cbRegister[data.id]);
                }
            };

            // bind event handlers
            util.ev
                .unbind(window, 'message', handler);
                .bind(window, 'message', handler);

            // make the request
            var req = {query: query, id: guid()};

            // register the callback
            cbRegister[req.id] = cb;

            // fire the message
            var win = $el.length ? $el[0] : $el;
            console.log(win, req);
            win.postMessage(JSON.stringify(req), (origin || '*'));
        });
    };
}));
