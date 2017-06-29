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

}(this, function ($, undefined) {

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

            $(window)
              .off('load.fepopstate')
              .on('load.fepopstate', function() {

                  var originalLocation = window.location.pathname,
                      hashChange = '';

                  $("a[href*=\\#]").off('click.fepopstate')
                    .on('click.fepopstate', function(e) {

                        var link = $(this).attr('href');
                        hashChange = link.substr(link.indexOf('#'));
                    });

                  // hack to dodge popstate onload in older buggy history api implementations
                  setTimeout(function() {

                      // the page reload is a blunt instrument and needs to be reviewed
                      // it's not properly handling hash changes and old popstate implemntations fire
                      // a popstate on load

                      $(window)
                          .off('popstate.fepopstate')
                          .on('popstate.fepopstate', function(e) {

                              // default
                              var doReload = originalLocation != window.location.pathname;

                              doReload = doReload || (window.location.hash != hashChange);

                              // if this is a state we pushed then do some stuff
                              if (e.originalEvent.state && e.originalEvent.state.key !== undefined) {

                                  // get the state
                                  var state = moduleConfs[e.originalEvent.state.key] || null;

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
                          });
                  }, 50);
              });
        }
    };
}))
