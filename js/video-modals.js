;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery', './modals'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./modals'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.videoModals = factory(root.jQuery, root.catch.modals);
    }

}(this, function ($, modals, undefined) {

    'use strict';

    var videoModals = function(conf) {

        // conf default
        conf = conf || {};

        $(function() {

            // classic + the strings together...
            var defaultTemplate =   '<div class="modal hidden" id="video-modal">' +
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
            var selector = conf.selector || '.video-modal',
                namespace = conf.namespace || 'video-modal',
                modalTemplate = conf.modalTemplate || defaultTemplate,
                onAfterShow = conf.onAfterShow || null,
                onBeforeShow = conf.onBeforeShow || null;

            // prep modal
            var trigger = '<a class="modal-trigger" id="video-modal-trigger" data-modal="#video-modal"></a>',
                template =  $(modalTemplate).attr('id', 'video-modal')[0].outerHTML;

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


            // handle each elem that matches the selector
            $(selector).each(function(idx) {

                // vars
                var $el = $(this),
                    elId = uid($el);

                // Video Modals
                $el .off('click.videoModal')
                    .on('click.videoModal', function(e) {

                        // don't go anywhere
                        e.preventDefault();

                        // vars
                        var $this = $(this),
                            link = $this.attr('data-embed-link') || $this.attr('href'),
                            $content = $(
                                '<div class="video-container responsive-iframe">' +
                                    '<iframe id="video-modal-iframe" ' +
                                            'width="400" ' +
                                            'height="300" ' +
                                            'frameborder="0" ' +
                                            'hspace="0" ' +
                                            'webkitallowfullscreen ' +
                                            'mozallowfullscreen ' +
                                            'allowfullscreen ' +
                                            ($('html.ie').length ? 'allowtransparency="true" ' : '') + '></iframe>' +
                                '</div>'
                            );

                        // prepare the modal
                        var $modal = $(trigger + template.replace(/\{\{content\}\}/, $content[0].outerHTML));

                        // inject the modal
                        $('body').append($modal);
                        modals();

                        // lifecycle callback
                        if (typeof onBeforeShow == 'function') onBeforeShow();

                        // show the modal
                        $('#video-modal-trigger').trigger('click');
                        $modal.find('#video-modal-iframe').attr('src', link);

                        // attach the close function
                        $('.modal-close, .body-overlay').on('tap click', function(e) {

                            // remove modal
                            $modal.remove();
                        });

                        // rebind handlers
                        videoModals(conf);
                        if (typeof picturefill == 'function') picturefill();

                        // lifecycle callback
                        if (typeof onAfterShow == 'function') onAfterShow();

                    })
                    .addClass('video-modalised');

            })
        });
    };

    return videoModals;
}));
