;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.popstate = factory(root.jQuery);
    }

}(this, function ($, ajaxModals, undefined) {

    'use strict';

    // we need to save object references for configs as push state gets sad about references
    // as it wants a clean clone
    var objKey = 0,
        moduleConfs = {};

    return {

        /**
         * push state proxy
         * @param  {object} stateObj [description]
         * @param  {string} title    [description]
         * @param  {string} url      [description]
         * @return {void}            [description]
         */
        pushState: function(stateObj, title, url) {
            if (typeof window.history.pushState !== undefined) {
                moduleConfs[objKey] = stateObj;
                window.history.pushState({key: objKey}, title, url);
                objKey++;
            }
        },

        /**
         * binds the pop state handler
         * @return {void} [description]
         */
        bindPopState: function() {

            $(function() {

                // navigate to the right location
                // what would be awesome is if we stashed all the info
                // to fire another ajax modal request and display that
                // instead we are just triggering a page reload
                window.onpopstate = function(e) {

                    // default
                    var doReload = true;

                    // if this is a state we pushed then do some stuff
                    if (e.state && e.state.key !== undefined) {

                        // get the state
                        var state = moduleConfs[e.state.key] || null;

                        // did we find something?
                        if (state) {

                            // are we reloading
                            if (state.doReload !== undefined) doReload = state.doReload;

                            // is there a callback
                            if (typeof state.callback == 'function') state.callback();
                        }
                    }

                    // attempt to bypass states pushed by backbone
                    if (window.Backbone !== undefined && window.Backbone.history.handlers.length > 0) {
                        doReload = false;
                    }

                    // make sure the page reloads if we want it to and it hasn't already
                    if (window.location.reload !== undefined && doReload) {
                        window.location.reload();
                    }
                };
            });
        }
    };
}))
