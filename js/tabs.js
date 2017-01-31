;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery', './popstate', './util'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./popstate'), require('./util'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.tabs = factory(root.jQuery, root.catch.popstate, root.catch.util);
    }

}(this, function ($, popstate, util, undefined) {

    'use strict';

    return function(conf) {

        // set some defaults and resolve a config set
        var opts = $.extend(
            {},
            {
                useHistory: true
            },
            conf
        );

        // do stuff on dom ready
        $(function() {

            if (opts.useHistory) popstate.bindPopState();

            // utility functions
            var pushHistory = function($el) {

                    var url = $el.attr('data-url') || null,
                        elId = uid($el)

                    if (url)
                        popstate.pushState(
                            {
                                id: elId,
                                url: url,
                                type: $el.is('#ajax-modal-modal *') ? 'ajax-modal-tab' : 'tab',
                                doReload: false,
                                callback: function() {
                                    $el.trigger('click', false);
                                }
                            },
                            '',
                            url
                        );
                },
                uid = util.uuid;

        	$('li[role="tab"]')
                .off('click.tabs')
                .on('click.tabs', function(e, pushState) {

                    var $this = $(this),
                        pushState = pushState === undefined ? true : pushState,
                        $tabsParent = $this.closest('[role="tablist"]'),
                        tabpanid = $this.attr('aria-controls'),
                        $tabpan = $('#' + tabpanid);

                    $tabsParent.find('li[role="tab"]').not(this).attr('aria-selected', 'false');
                    $this.attr('aria-selected', 'true').trigger('change');

                    $tabpan.siblings('div[role="tabpanel"]').not($tabpan[0]).attr('aria-hidden', 'true');
                    $tabpan.attr('aria-hidden', 'false');

                    if (opts.useHistory && pushState) pushHistory($this);

                    $(window).trigger('resize');
                });

            //This adds keyboard accessibility by adding the enter key to the basic click event.
            $('li[role="tab"]')
                .off('keydown.tabs-enter')
                .on('keydown.tabs-enter', function(ev) {
                    if (ev.which == 13) $(this).trigger('click');
                });

            // This adds keyboard function that pressing an arrow left or arrow right from the tabs toggle the tabs.
            $("li[role='tab']")
                .off('keydown.tabs')
                .on('keydown.tabs', function(ev) {
                    if ((ev.which == 39) || (ev.which == 37)) {
						
                        var selected = $(this).attr('aria-selected');
						
                        if (selected == 'true') {

                            $('li[aria-selected="false"]').attr('aria-selected', 'true').focus().trigger('change');
                            $(this).attr('aria-selected', 'false');

                            var tabpanid = $('li[aria-selected="true"]').attr('aria-controls'),
                                $tabpan = $('#' + tabpanid);

                            $('div[role="tabpanel"]').not($tabpan[0]).attr('aria-hidden', 'true');
                            $tabpan.attr('aria-hidden', 'false');

                            if (opts.useHistory) pushHistory($('li[aria-selected="true"]'));

                        }
                    }
                });
			
			// make sure everything is legit
			$('[aria-selected="true"').trigger('click');
        });
    }

}))
