;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define(
            [
                'jquery',
                './modals',
                './util',
                './../../pagr/pagr'
            ],
            factory
        );

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery'),
            require('./modals'),
            require('./util'),
            require('./../../pagr/pagr')
        );

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.ajaxForms = factory(
            root.jQuery,
            root.catch.modals,
            root.catch.util
        );
    }

}(this, function ($, modals, util, pagr, undefined) {

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
                selector = conf.selector || '.js-ajax-form',
                actionSelector = conf.actionSelector || '.js-ajax-form-action',
                successTestCb = conf.successTestCb || function(data, textStatus, jqXHR) { return true; },
                onBeforeRequest = conf.onBeforeRequest || null,
                onAfterRequest = conf.onAfterRequest || null,
                onAfterCloseResultModal = conf.onAfterCloseResultModal || null,
                customValidator = conf.customValidator || function($form) { return true; },
                showModalDefault = conf.showModal || true,
                modalTemplate = conf.modalTemplate ||
                    '<div class="m-modal m-modal--form s-hidden" id="ajax-form-modal">' +
                        '<div class="m-modal__dialog m-modal__dialog--compact">' +
                            '<div class="m-modal__close">' +
                                '<div class="m-modal__close__inner">' +
                                    '<a class="m-modal__close__trigger h-icon--close">Close</a>' +
                                '</div>' +
                            '</div>' +
                            '<div class="m-modal__body">' +
                                '<div class="m-modal__body__inner">' +
                                    '<h1 class="m-modal__body__title">{{title}}</h1>' +
                                    '<div class="m-modal__body__content"><p>{{content}}</p></div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>',
                serialiser = conf.serialiser || function($form, action) {

                    var data = $form.serialize(),
                        method = $form.attr('method') ? $form.attr('method') : 'get';


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

                    return {
                        action: action,
                        data: data
                    };
                },
                ajaxProxy = conf.ajaxProxy || function(action, method, $form, onAfterRequest) {

                    console.log(arguments);

                    // default
                    action = action || window.location.href;

                    // vars
                    var enctype = $form.attr('enctype') ? $form.attr('enctype') : 'application/x-www-form-urlencoded',
                        serialised = serialiser($form, action),
                        data = serialised.data;

                    // update the action in case it changed (i.e GET requests)
                    action = serialised.action;

                    if (enctype == 'multipart/form-data') {

                        // setup
                        var $target = $('#' + $form.attr('target'));

                        // override listener
                        $target[0].onload = function() {
                            onAfterRequest($target.contents().find('body').html(), 'success');
                        };

                    }
                    else $[method](action, data, onAfterRequest);
                };


            var trigger = '<a class="m-modal-trigger" id="ajax-form-modal-trigger" data-modal="#ajax-form-modal"></a>',
                template =  $(modalTemplate).attr('id', 'ajax-form-modal')[0].outerHTML,
                uid = util.elemId;

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
                            showModal = $this.attr('data-show-modal') || showModalDefault,
                            scrollTo = $this.attr('data-scroll-to'),
                            embedTracking = $this.attr('data-success-tracking-embed'),
                            gaTracking = $this.attr('data-success-tracking-ga'),
                            gtmDataLayer = $this.attr('data-gtm-data-layer') || 'dataLayer',
                            gtmTracking = $this.attr('data-success-tracking-gtm'),
                            msg = $this.attr('data-success-message'),
                            title = $this.attr('data-success-title'),
                            msgFail = $this.attr('data-fail-message'),
                            titleFail = $this.attr('data-fail-title'),
                            $template = $(trigger + template.replace(/\{\{title\}\}/, title).replace(/\{\{content\}\}/, msg)),
                            $templateFail = $(trigger + template.replace(/\{\{title\}\}/, titleFail).replace(/\{\{content\}\}/, msgFail)),
                            disabledClass = $this.attr('data-disabled-class') || 'disabled',
                            maxSubmissions = $this.attr('data-max-submissions'),
                            disabled =  $this.is('.' + disabledClass),
                            action = $this.attr('action'),
                            submissionCount = $this.attr('data-submission-count') || 0,
                            method = $this.attr('method') || 'get',
                            validate = $this.is('[data-validate]'),
                            validateOnly = $this.attr('data-ajax-validate-only') || null;

                        if (
                            !$('html').is('.s-loading') &&
                            !disabled &&
                            (maxSubmissions == undefined || parseInt(submissionCount) < parseInt(maxSubmissions)) &&
                            (!validate || (validate && $this.validator('validate', validateOnly))) &&
                            customValidator($form)
                        ) {

                            // We are loading
                            $('html').addClass('s-loading');

                            // lifecycle call back
                            if (typeof onBeforeRequest == 'function') onBeforeRequest($this);

                            // make the request
                            ajaxProxy(action, method, $this, function(data, textStatus, jqXHR) {

                                if (replace != '0' || replace != 'false') {
                                    if (replace == undefined) $form.html($($(data).find(selector)[idx]).html());
                                    else $(replace).html($(data).find(replace).html());
                                }

                                ajaxForms(conf);

                                if (typeof picturefill == 'function') picturefill();

                                $this.attr('data-submission-count', parseInt(submissionCount || 0) + 1);
                                if (maxSubmissions != undefined && submissionCount + 1 >= maxSubmissions) $this.addClass(disabledClass);
                                $('html').removeClass('s-loading');

                                if (scrollTo != undefined)
                                    $('html, body, .body').animate({
                                        scrollTop: $(scrollTo).offset().top
                                    }, 600);

                                // success
                                if (textStatus == 'success' && successTestCb(data, textStatus, jqXHR)) {

                                    if (showModal) {

                                        // re grab the data
                                        msg = $this.attr('data-success-message');
                                        title = $this.attr('data-success-title');
                                        $template = $(trigger + template.replace(/\{\{title\}\}/, title).replace(/\{\{content\}\}/, msg));

                                        if (msg != undefined) {
                                            $body.append($template);
                                            modals();
                                            $('#ajax-form-modal-trigger').trigger('tap').trigger('click');
                                            $('.m-modal__close__trigger, .m-modal__close-trigger, .body-overlay').on('tap click',function(e) {

                                                // was it the ajax modal?
                                                if ($('body').find('#ajax-form-modal').length > 0) {

                                                    // remove the modal
                                                    $template.remove();

                                                    // lifecycle callback
                                                    if (typeof onAfterCloseResultModal == 'function')
                                                        onAfterCloseResultModal($this, {success: true, message: 'success'});
                                                }
                                            });
                                        }
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
                                }

                                // fail
                                else {

                                    if (showModal) {

                                        // re grab the data
                                        msgFail = $this.attr('data-fail-message');
                                        titleFail = $this.attr('data-fail-title');
                                        $templateFail = $(trigger + template.replace(/\{\{title\}\}/, titleFail).replace(/\{\{content\}\}/, msgFail));

                                        if (msgFail != undefined) {
                                            $body.append($templateFail);
                                            modals();
                                            $('#ajax-form-modal-trigger').trigger('tap').trigger('click');
                                            $('.m-modal__close__trigger, .m-modal__close-trigger, .body-overlay').on('tap click',function(e) {

                                                // was it the ajax modal
                                                if ($('body').find('#ajax-form-modal').length > 0) {

                                                    // remove the modal
                                                    $templateFail.remove();

                                                    // lifecycle callback
                                                    if (typeof onAfterCloseResultModal == 'function')
                                                        onAfterCloseResultModal($this, {success: false, message: 'fail'});
                                                }
                                            });
                                        }
                                    }
                                }

                                if (typeof onAfterRequest == 'function') onAfterRequest($this, data);

                            });
                        }
                    })
                    .find(actionSelector)
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
                                showModal = $this.attr('data-show-modal') || $form.attr('data-show-modal') || showModalDefault,
                                scrollTo = $this.attr('data-scroll-to') || $form.attr('data-scroll-to'),
                                embedTracking = $this.attr('data-success-tracking-embed') || $form.attr('data-success-tracking-embed'),
                                gaTracking = $this.attr('data-success-tracking-ga') || $form.attr('data-success-tracking-ga'),
                                gtmTracking = $this.attr('data-success-tracking-gtm') || $form.attr('data-success-tracking-gtm'),
                                gtmDataLayer = $this.attr('data-gtm-data-layer') || $form.attr('data-gtm-data-layer'),
                                msg = $this.attr('data-success-message') || $form.attr('data-success-message'),
                                title = $this.attr('data-success-title') || $form.attr('data-success-title'),
                                msgFail = $this.attr('data-fail-message') || $form.attr('data-fail-message'),
                                titleFail = $this.attr('data-fail-title') || $form.attr('data-fail-title'),
                                $template = $(trigger + template.replace(/\{\{title\}\}/, title).replace(/\{\{content\}\}/, msg)),
                                $templateFail = $(trigger + template.replace(/\{\{title\}\}/, titleFail).replace(/\{\{content\}\}/, msgFail)),
                                action = $this.attr('data-action') || $form.attr('action'),
                                disabledClass = $this.attr('data-disabled-class') || $form.attr('data-disabled-class') || 'disabled',
                                maxSubmissions = $this.attr('data-max-submissions') || $form.attr('data-max-submissions'),
                                disabled =  $this.is('.' + disabledClass),
                                submissionCount = $this.attr('data-submission-count') || $form.attr('data-submission-count') || 0,
                                method = $this.attr('data-method') || $form.attr('method') || 'get',
                                validate = $this.is('[data-validate]'),
                                validateOnly = $this.attr('data-ajax-validate-only') || $form.attr('data-ajax-validate-only');

                            if (
                                !$('html').is('.s-loading') &&
                                !disabled &&
                                (maxSubmissions == undefined || parseInt(submissionCount) < parseInt(maxSubmissions)) &&
                                (!validate || (validate && $this.closest('form').validator('validate', validateOnly))) &&
                                customValidator($form)
                            ) {

                                // We are loading
                                $('html').addClass('s-loading');

                                // lifecycle call back
                                if (typeof onBeforeRequest == 'function') onBeforeRequest($this);

                                // make the request
                                ajaxProxy(action, method, $form, function(data, textStatus, jqXHR) {

                                    if (replace != '0' || replace != 'false') {
                                        if (replace == undefined) $form.html($($(data).find(selector)[idx]).html());
                                        else $(replace).html($(data).find(replace).html());
                                    }

                                    ajaxForms(conf);

                                    if (typeof picturefill == 'function') picturefill();

                                    $this.attr('data-submission-count', parseInt(submissionCount || 0) + 1);
                                    if (maxSubmissions != undefined && submissionCount + 1 >= maxSubmissions) $this.addClass(disabledClass);
                                    $('html').removeClass('s-loading');

                                    if (scrollTo != undefined)
                                        $('html, body. .body').animate({
                                            scrollTop: $(scrollTo).offset().top
                                        }, 600);

                                    // success
                                    if (textStatus == 'success' && successTestCb(data, textStatus, jqXHR)) {
                                        
                                        if (showModal) {
                                        
                                            // make sure the dats are there if they changed
                                            msg = $this.attr('data-success-message') || $form.attr('data-success-message');
                                            title = $this.attr('data-success-title') || $form.attr('data-success-title');
                                            $template = $(trigger + template.replace(/\{\{title\}\}/, title).replace(/\{\{content\}\}/, msg));

                                            if (msg != undefined) {
                                                $body.append($template);
                                                modals();
                                                $('#ajax-form-modal-trigger').trigger('tap');
                                                $('.m-modal__close__trigger, .m-modal__close-trigger, .body-overlay').on('tap',function(e) {

                                                    // was it the ajax modal
                                                    if ($('body').find('#ajax-form-modal').length > 0) {

                                                        // remove the modal
                                                        $template.remove();

                                                        // lifecycle callback
                                                        if (typeof onAfterCloseResultModal == 'function')
                                                            onAfterCloseResultModal($form, {success: true, message: 'success'});
                                                    }
                                                });
                                            }
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
                                    }

                                    // fail
                                    else {

                                        if (showModal) {
                                            
                                            // re grab the datas
                                            msgFail = $this.attr('data-fail-message') || $form.attr('data-fail-message');
                                            titleFail = $this.attr('data-fail-title') || $form.attr('data-fail-title');
                                            $templateFail = $(trigger + template.replace(/\{\{title\}\}/, titleFail).replace(/\{\{content\}\}/, msgFail));

                                            // fail?
                                            if (msgFail != undefined) {
                                                $body.append($templateFail);
                                                modals();
                                                $('#ajax-form-modal-trigger').trigger('tap');
                                                $('.m-modal__close__trigger, .m-modal__close-trigger, .body-overlay').on('tap',function(e) {

                                                    // was it the ajax modal
                                                    if ($('body').find('#ajax-form-modal').length > 0) {

                                                        // remove the modal
                                                        $templateFail.remove();

                                                        // lifecycle callback
                                                        if (typeof onAfterCloseResultModal == 'function')
                                                            onAfterCloseResultModal($form, {success: false, message: 'fail'});
                                                    }
                                                });
                                            }
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
