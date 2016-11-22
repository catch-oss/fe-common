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
                                                    '<a href="" class="modal-close h-icon-close">Close</a>' +
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
                },
                parseLink = function($el, autoplay) {

                        // defaults
                        autoplay = autoplay || false;

                        // init vars
                        var matches,
                            r = {
                                href: null,
                                type: null
                            },
                            id = uid($el),
                            link = $el.attr('data-embed-link') || $el.attr('href');

                        // do we have a link
                        if (!link) return r;

                        // generate embed code if there's a link
                        if (matches = link.match(/(youtube\.com|youtu\.be)\/(v\/|u\/|embed\/|watch\?v=)?([^#\&\?]*).*/)) {
                            r.href = '//www.youtube.com/embed/' + matches[3] +
                                    '?autohide=2&fs=0&rel=0&enablejsapi=1&modestbranding=1&showinfo=0' +
                                    (autoplay ? '&autoplay=1' : '');
                            r.type = 'iframe';
                        }
                        else if (matches = link.match(/vimeo.com\/(video\/)?(\d+)\/?(.*)/)) {
                            r.href = '//player.vimeo.com/video/' + matches[2] +
                                    '?hd=1&api=1&show_title=1&show_byline=1&badge=0&show_portrait=0&color=&fullscreen=1' +
                                    (id ? '&player_id=' + id : '') + (autoplay ? '&autoplay=1' : '');
                            r.type = 'iframe';
                        }
                        else if (matches = link.match(/vimeo.com\/channels\/(.+)\/(\d+)\/?/)) {
                            r.href = '//player.vimeo.com/video/' + matches[2] +
                                    '?hd=1&api=1&show_title=1&show_byline=1&badge=0&show_portrait=0&color=&fullscreen=1' +
                                    (id ? '&player_id=' + id : '') + (autoplay ? '&autoplay=1' : '');
                            r.type = 'iframe';
                        }
                        else if (matches = link.match(/metacafe.com\/watch\/(\d+)\/?(.*)/)) {
                            r.href = '//www.metacafe.com/fplayer/' + matches[1] +
                                    '/.swf' + (autoplay ? '?playerVars=autoPlay=yes' : '');
                            r.type = 'swf';
                        }
                        else if (matches = link.match(/dailymotion.com\/video\/(.*)\/?(.*)/)) {
                            r.href = '//www.dailymotion.com/swf/video/' + matches[1] +
                                    '?additionalInfos=0' + (autoplay ? '&autoStart=1' : '');
                            r.type = 'swf';
                        }
                        else if (matches = link.match(/twitvid\.com\/([a-zA-Z0-9_\-\?\=]+)/)) {
                            r.href = '//www.twitvid.com/embed.php?guid=' + matches[1] +
                                    (autoplay ? '&autoplay=1' : '&autoplay=0');
                            r.type = 'iframe';
                        }
                        else if (matches = link.match(/twitpic\.com\/(?!(?:place|photos|events)\/)([a-zA-Z0-9\?\=\-]+)/)) {
                            r.href = '//twitpic.com/show/full/' + matches[1];
                            r.type = 'image';
                        }
                        else if (matches = link.match(/(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/)) {
                            r.href = '//' + matches[1] + '/p/' + matches[2] + '/media/?size=l';
                            r.type = 'image';
                        }
                        else if (matches = link.match(/maps\.google\.com\/(\?ll=|maps\/?\?q=)(.*)/)) {
                            r.href = '//maps.google.com/' + matches[1] + '' + matches[2] +
                                    '&output=' + ((strpos(matches[2], 'layer=c')) ? 'svembed' : 'embed');
                            r.type = 'iframe';
                        }

                        return r;
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
                            link = parseLink($el, true).href,
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
                        if (typeof onBeforeShow == 'function') onBeforeShow.call(this);

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
                        if (typeof onAfterShow == 'function') onAfterShow.call(this);

                    })
                    .addClass('video-modalised');

            })
        });
    };

    return videoModals;
}));
