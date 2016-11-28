;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define(['jquery', './modals', './../../pagr/pagr'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(require('jquery'), require('./modals'), require('./../../pagr/pagr'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.ajaxForms = factory(root.jQuery, root.catch.modals);
    }

}(this, function ($, modals, pagr, undefined) {

    'use strict';

    var ajaxForms = function() {

        var conf = arguments[0];

        // handle old syntax
        // selector, onAfterRequest, namespace, successTestCb, modalTemplate
        if (typeof conf != 'object') {
            conf = {
                selector: arguments[0],
                onAfterRequest: arguments[1],
                namespace: arguments[2],
                successTestCb: arguments[3],
                modalTemplate: arguments[4],
                onBeforeRequest: arguments[5],
                onAfterCloseResultModal: arguments[6]
            }
        }

        $(function() {

            var namespace = conf.namespace || 'ajax-form',
                selector = conf.selector || '.ajax-form',
                successTestCb = conf.successTestCb || function(data, textStatus, jqXHR) { return true; },
                onBeforeRequest = conf.onBeforeRequest || null,
                onAfterRequest = conf.onAfterRequest || null,
                onAfterCloseResultModal = conf.onAfterCloseResultModal || null,
                modalTemplate = conf.modalTemplate ||
                    '<div class="m-modal m-modal--form is-hidden" id="ajax-form-modal">' +
                        '<div class="m-modal__dialog m-modal--compact">' +
                            '<div class="m-modal__close">' +
                                '<div class="m-modal__close__inner">' +
                                    '<a href="" class="m-modal__close__trigger h-icon-close">Close</a>' +
                                '</div>' +
                            '</div>' +
                            '<div class="m-modal__body">' +
                                '<div class="m-modal__body__inner">' +
                                    '<h1 class="m-modal__body__title">{{title}}</h1>' +
                                    '<div class="m-modal__body__content"><p>{{content}}</p></div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

            var trigger = '<a class="m-modal-trigger" id="ajax-form-modal-trigger" data-modal="#ajax-form-modal"></a>',
                template =  $(modalTemplate).attr('id', 'ajax-form-modal')[0].outerHTML,
                uid = function($elem, idBase) {

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
                ajaxProxy = function(action, $form, onAfterRequest) {

                    // default
                    action = action || window.location.href;

                    // vars
                    var enctype = $form.attr('enctype') ? $form.attr('enctype') : 'application/x-www-form-urlencoded',
                        method = $form.attr('method') ? $form.attr('method') : 'get',
                        data = $form.serialize();

                    // if we are doing a get then jQuery is a bit of retard in terms of building the URL
                    if (method == 'get' && action.split('?').length > 1) {

                        // handle the params
                        var curOpts = $.q2obj(action.split('?')[1]),
                            newOpts = $.q2obj(data),
                            allOpts = $.extend({}, curOpts, newOpts);

                        // update the vars
                        data = $.param(allOpts);
                        action = action.split('?')[0];
                    }

                    if (enctype == 'multipart/form-data') {

                        // setup
                        var $target = $('#' + $form.attr('target'));

                        // override listener
                        $target[0].onload = function() {
                            onAfterRequest($target.contents().find("body").html(), 'success');
                        };

                    }
                    else $[method](action, data, onAfterRequest);
                };

            $(selector).each(function(idx){

                // vars
                var $form = $(this),
                    enctype = $form.attr('enctype') ? $form.attr('enctype') : 'application/x-www-form-urlencoded';

                // attach iframe target
                if (enctype == 'multipart/form-data') {

                    // setup
                    var $target = $('<iframe />').css('display','none'),
                        id = uid($target, 'ajax-form-target');

                    // append + add name
                    $('body').append($target.attr('name',id));

                    // update form
                    $form.attr('target', id)
                         .attr('data-allow-default', 1);
                }

                // attach submit handlers
                $form
                    .off('submit.' + namespace)
                    .on('submit.' + namespace, function(e) {

                        if (!$(this).attr('data-allow-default')) e.preventDefault();

                        var $this = $(this),
                            $body = $('.body').length ? $('.body') : $('body'),
                            replace = $this.attr('data-replace'),
                            scrollTo = $this.attr('data-scroll-to'),
                            msg = $this.attr('data-success-message'),
                            embedTracking = $this.attr('data-success-tracking-embed'),
                            gaTracking = $this.attr('data-success-tracking-ga'),
                            gtmDataLayer = $this.attr('data-gtm-data-layer') || 'dataLayer',
                            gtmTracking = $this.attr('data-success-tracking-gtm'),
                            title = $this.attr('data-success-title'),
                            msgFail = $this.attr('data-fail-message'),
                            titleFail = $this.attr('data-fail-title'),
                            $template = $(trigger + template.replace(/\{\{title\}\}/, title).replace(/\{\{content\}\}/, msg)),
                            $templateFail = $(trigger + template.replace(/\{\{title\}\}/, titleFail).replace(/\{\{content\}\}/, msgFail)),
                            disabledClass = $this.attr('data-disabled-class') || 'disabled',
                            maxSubmissions = $this.attr('data-max-submissions'),
                            disabled =  $this.is('.' + disabledClass),
                            submissionCount = $this.attr('data-submission-count') || 0,
                            method = $this.attr('method') ? $this.attr('method') : 'get',
                            validate = $this.is('[data-validate]'),
                            validateOnly = $this.attr('data-ajax-validate-only') || null;

                        if (
                            !$('html').is('.is-loading') &&
                            !disabled &&
                            (maxSubmissions == undefined || parseInt(submissionCount) < parseInt(maxSubmissions)) &&
                            (!validate || (validate && $this.validator('validate', validateOnly)))
                        ) {

                            // We are loading
                            $('html').addClass('is-loading');

                            // lifecycle call back
                            if (typeof onBeforeRequest == 'function') onBeforeRequest($this);

                            // make the request
                            ajaxProxy($this.attr('action'), $this, function(data, textStatus, jqXHR) {

                                if (replace == undefined) $form.html($($(data).find(selector)[idx]).html());
                                else $(replace).html($(data).find(replace).html());

                                ajaxForms(conf);

                                if (typeof picturefill == 'function') picturefill();

                                $this.attr('data-submission-count', parseInt(submissionCount || 0) + 1);
                                if (maxSubmissions != undefined && submissionCount + 1 >= maxSubmissions) $this.addClass(disabledClass);
                                $('html').removeClass('is-loading');

                                if (scrollTo != undefined)
                                    $('html, body, .body').animate({
                                        scrollTop: $(scrollTo).offset().top
                                    }, 600);

                                if (textStatus == 'success' && successTestCb(data, textStatus, jqXHR)) {
                                    if (msg != undefined) {
                                        $body.append($template);
                                        modals();
                                        $('#ajax-form-modal-trigger').trigger('tap').trigger('click');
                                        $('.m-modal__close__trigger, .body-overlay').on('tap click',function(e) {

                                            // remove the modal
                                            $template.remove();

                                            // lifecycle callback
                                            if (typeof onAfterCloseResultModal == 'function')
                                                onAfterCloseResultModal($this, {success: true, message: 'success'});
                                        });
                                    }

                                    // just chuck in the embed code
                                    if (embedTracking) {
                                        $('body').append(embedTracking);
                                    }

                                    // expects gtmTracking to be {key: value, key2: value2}
                                    // see https://developers.google.com/tag-manager/devguide?hl=en for more info
                                    if (gtmTracking) {
                                        gtmTracking = JSON.parse(gtmTracking);
                                        window[gtmDataLayer].push(gtmTracking);
                                    }

                                    // expects gaTracking to be {action: 'send', data {hitType: 'pageview'}}
                                    // see https://developers.google.com/analytics/devguides/collection/analyticsjs/how-analyticsjs-works for more info
                                    if (gaTracking) {
                                        gaTracking = JSON.parse(gaTracking);
                                        window.ga(gaTracking.action, gaTracking.data);
                                    }
                                } else {
                                    if (msgFail != undefined) {
                                        $body.append($templateFail);
                                        modals();
                                        $('#ajax-form-modal-trigger').trigger('tap').trigger('click');
                                        $('.m-modal__close__trigger, .body-overlay').on('tap click',function(e) {

                                            // remove the modal
                                            $templateFail.remove();

                                            // lifecycle callback
                                            if (typeof onAfterCloseResultModal == 'function')
                                                onAfterCloseResultModal($this, {success: false, message: 'fail'});
                                        });
                                    }
                                }

                                if (typeof onAfterRequest == 'function') onAfterRequest($this, data);

                            });
                        }
                    })
                    .find('.form-action')
                        .off('tap.' + namespace)
                        .off('click.' + namespace)
                        .off('change.' + namespace)
                        .on('click.' + namespace + ' tap.' + namespace + ' change.' + namespace, function(e) {

                            if (!$(this).attr('data-allow-default')) e.preventDefault();

                            // look for most of the info locally or fall back to the form for params
                            var $this = $(this),
                                $form = $this.closest('form'),
                                $body = $('.body').length ? $('.body') : $('body'),
                                replace = $this.attr('data-replace') || $form.attr('data-replace'),
                                scrollTo = $this.attr('data-scroll-to') || $form.attr('data-scroll-to'),
                                msg = $this.attr('data-success-message') || $form.attr('data-success-message'),
                                embedTracking = $this.attr('data-success-tracking-embed') || $form.attr('data-success-tracking-embed'),
                                gaTracking = $this.attr('data-success-tracking-ga') || $form.attr('data-success-tracking-ga'),
                                gtmTracking = $this.attr('data-success-tracking-gtm') || $form.attr('data-success-tracking-gtm'),
                                gtmDataLayer = $this.attr('data-gtm-data-layer') || $form.attr('data-gtm-data-layer'),
                                title = $this.attr('data-success-title') || $form.attr('data-success-title'),
                                msgFail = $this.attr('data-fail-message') || $form.attr('data-fail-message'),
                                titleFail = $this.attr('data-fail-title') || $form.attr('data-fail-title'),
                                $template = $(trigger + template.replace(/\{\{title\}\}/, title).replace(/\{\{content\}\}/, msg)),
                                $templateFail = $(trigger + template.replace(/\{\{title\}\}/, titleFail).replace(/\{\{content\}\}/, msgFail)),
                                action = $this.attr('data-action') || $form.attr('data-action'),
                                disabledClass = $this.attr('data-disabled-class') || $form.attr('data-disabled-class') || 'disabled',
                                maxSubmissions = $this.attr('data-max-submissions') || $form.attr('data-max-submissions'),
                                disabled =  $this.is('.' + disabledClass),
                                submissionCount = $this.attr('data-submission-count') || $form.attr('data-submission-count') || 0,
                                method = $this.attr('data-method') ? $this.attr('data-method') : 'get',
                                validate = $this.is('[data-validate]'),
                                validateOnly = $this.attr('data-ajax-validate-only') || $form.attr('data-ajax-validate-only');

                            if (
                                !$('html').is('.is-loading') &&
                                !disabled &&
                                (maxSubmissions == undefined || parseInt(submissionCount) < parseInt(maxSubmissions)) &&
                                (!validate || (validate && $this.closest('form').validator('validate', validateOnly)))
                            ) {

                                // We are loading
                                $('html').addClass('is-loading');

                                // lifecycle call back
                                if (typeof onBeforeRequest == 'function') onBeforeRequest($this);

                                // make the request
                                ajaxProxy($this.attr('action'), $form, function(data, textStatus, jqXHR) {

                                    if (replace == undefined) $form.html($($(data).find(selector)[idx]).html());
                                    else $(replace).html($(data).find(replace).html());

                                    ajaxForms(conf);

                                    if (typeof picturefill == 'function') picturefill();

                                    $this.attr('data-submission-count', parseInt(submissionCount || 0) + 1);
                                    if (maxSubmissions != undefined && submissionCount + 1 >= maxSubmissions) $this.addClass(disabledClass);
                                    $('html').removeClass('is-loading');

                                    if (scrollTo != undefined)
                                        $('html, body. .body').animate({
                                            scrollTop: $(scrollTo).offset().top
                                        }, 600);

                                    if (textStatus == 'success' && successTestCb(data, textStatus, jqXHR)) {
                                        if (msg != undefined) {
                                            $body.append($template);
                                            modals();
                                            $('#ajax-form-modal-trigger').trigger('tap');
                                            $('.m-modal__close__trigger, .body-overlay').on('tap',function(e) {

                                                // remove the modal
                                                $template.remove();

                                                // lifecycle callback
                                                if (typeof onAfterCloseResultModal == 'function')
                                                    onAfterCloseResultModal($form, {success: true, message: 'success'});
                                            });
                                        }
                                        // just chuck in the embed code
                                        if (embedTracking) {
                                            $('body').append(embedTracking);
                                        }
                                        // expects gtmTracking to be {key: value, key2: value2}
                                        // see https://developers.google.com/tag-manager/devguide?hl=en for more info
                                        if (gtmTracking) {
                                            gtmTracking = JSON.parse(gtmTracking);
                                            window[gtmDataLayer].push(gtmTracking);
                                        }
                                        // expects gaTracking to be {action: 'send', data {hitType: 'pageview'}}
                                        // see https://developers.google.com/analytics/devguides/collection/analyticsjs/how-analyticsjs-works for more info
                                        if (gaTracking) {
                                            gaTracking = JSON.parse(gaTracking);
                                            window.ga(gaTracking.action, gaTracking.data);
                                        }
                                    } else {
                                        if (msgFail != undefined) {
                                            $body.append($templateFail);
                                            modals();
                                            $('#ajax-form-modal-trigger').trigger('tap');
                                            $('.m-modal__close__trigger, .body-overlay').on('tap',function(e) {

                                                // remove the modal
                                                $templateFail.remove();

                                                // lifecycle callback
                                                if (typeof onAfterCloseResultModal == 'function')
                                                    onAfterCloseResultModal($form, {success: false, message: 'fail'});
                                            });
                                        }
                                    }

                                    // lifecycle call back
                                    if (typeof onAfterRequest == 'function') onAfterRequest($this, data);

                                });
                            }
                        });
            })
        });
    };

    return ajaxForms;
}));
