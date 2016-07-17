;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery', './modals', './popstate'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./modals'), require('./popstate'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.ajaxModals = factory(root.jQuery, root.catch.modals, root.catch.popstate);
    }

}(this, function ($, modals, popstate, undefined) {

    'use strict';

    var originalURL = window.location.href,
        ajaxModals = function(conf) {

        // conf default
        conf = conf || {};

        $(function() {

            // classic + the strings together...
            var defaultTemplate =   '<div class="modal hidden" id="ajax-form-modal">' +
                                        '<div class="modal-dialog modal--compact">' +
                                            '<div class="modal-close-wrapper-mobile">' +
                                                '<div class="modal-close-wrapper-mobile-inner">' +
                                                    '<a href="" class="modal-close icon-close">Close</a>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div class="modal-body">' +
                                                '<div class="modal-dialog-inner modal-dialog-inner-body">' +
                                                    '{{content}}' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>';

            // conf defaults
            var selector = conf.selector || '.ajax-modal',
                namespace = conf.namespace || 'ajax-modal',
                modalTemplate = conf.modalTemplate || defaultTemplate,
                onBeforeRequest = conf.onBeforeRequest || null,
                onBeforeShow = conf.onBeforeShow || null,
                onAfterRequest = conf.onAfterRequest || null,
                useHistory = conf.useHistory === undefined ? true : conf.useHistory,
                defaultContentSelector = conf.defaultContentSelector || 'body';

            // prep modal
            var trigger = '<a class="modal-trigger" id="ajax-modal-modal-trigger" data-modal="#ajax-modal-modal"></a>',
                template =  $(modalTemplate).attr('id', 'ajax-modal-modal')[0].outerHTML;

            // utility functions
            var uid = function($elem, idBase) {

                    var elementID = $elem.attr('id'),
                        idBase = idBase || $elem.text().replace(/[^A-Za-z0-9]+/g, '-').toLowerCase(),
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
                };

            // add a popstate handler if history is on
            if (useHistory) popstate.bindPopState();

            // handle each elem that matches the selector
            $(selector).each(function(idx) {

                // this wont change
                var $el = $(this);

                // handle the click
                $el.off('click.' + namespace).on('click.' + namespace, function(e) {

                    // vars (these might)
                    var $el = $(this),
                        elId = uid($el),
                        url = $el.attr('href'),
                        contentSelector = $el.attr('data-content-selector') || defaultContentSelector;

                    // don't go anywhere
                    e.preventDefault();

                    // do nothing if we are already loading
                    if (!$('html').is('.loading')) {

                        // indicate that we are loading
                        $('html').addClass('loading');

                        // look to see if there is already an active modal
                        var activeModal = $('body').attr('data-activeModal'),
                            $activeModal = $(activeModal);

                        // if the active modal exists
                        if ($activeModal.length) {

                            // hide it
                            $activeModal.addClass('hidden');

                            // remove any existing ajax modal stuff in the page
                            $('#ajax-modal-modal, #ajax-modal-modal-trigger').remove();
                        }

                        // lifecycle callback
                        if (typeof onBeforeRequest == 'function') onBeforeRequest($el);

                        // make the request
                        $.get(url, null, function(data, textStatus, jqXHR) {

                            // stop the loading animation
                            $('html').removeClass('loading');

                            // extract body
                            var re = /<body[^>]*>((.|[\n\r])*)<\/body>/im,
                                m = re.exec(data),
                                pre = m ? m[1] : data;

                            // re assign cleaned html
                            data = '<div>' + pre + '</div>';

                            // extract the content
                            var $content = $(data).find(contentSelector);

                            // prepare the modal
                            var $modal = $(trigger + template.replace(/\{\{content\}\}/, $content.html()));

                            // lifecycle callback
                            if (typeof onBeforeShow == 'function') onBeforeShow($modal);

                            // inject the modal
                            $('body').append($modal);
                            modals();
                            $('#ajax-modal-modal-trigger').trigger('tap');
                            $('.modal-close, .body-overlay').on('tap click', function(e) {

                                // push page into the history if history is on
                                if (useHistory)
                                    popstate.pushState(
                                        {id: elId, url: originalURL, type: 'page'},
                                        '',
                                        originalURL
                                    );

                                // remove modal
                                $modal.remove();
                            });

                            // rebind handlers
                            ajaxModals(conf);
                            if (typeof picturefill == 'function') picturefill();
                            if (typeof onAfterRequest == 'function') onAfterRequest($modal);

                            // push page into the history if history is on
                            if (useHistory)
                                popstate.pushState(
                                    {
                                        id: elId,
                                        url: url,
                                        type: 'ajax-modal',
                                        doReload: false,
                                        callback: function() {
                                            console.log('things');
                                            var $a = $(
                                                '<a href="' + url + '" ' +
                                                   'class="ajax-modal" ' +
                                                   'data-content-selector="' + contentSelector + '" />'
                                            );
                                            $('body').append($a);
                                            ajaxModals(conf);
                                            $a.trigger('click');
                                            $a.remove();
                                        }
                                    },
                                    '',
                                    url
                                );

                        }, 'html');
                    }
                });
            })
        });
    };

    return ajaxModals;
}));
