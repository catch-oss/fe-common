;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery', './modals'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./modals'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.ajaxForms = factory(root.jQuery);
    }

}(this, function ($, modals, undefined) {

    'use strict';

    var ajaxForms = function(selector, cb, namespace, successTestCb, modalTemplate) {

        $(function() {

            if (namespace === undefined)
                namespace = 'ajax-form';

            if (selector === undefined)
                selector = '.ajax-form';

            if (successTestCb === undefined)
                successTestCb = function(data, textStatus, jqXHR) { return true; };

            if (modalTemplate === undefined)
                modalTemplate = '<div class="modal hidden" id="ajax-form-modal">' +
                                    '<div class="modal-dialog modal--compact">' +
                                        '<div class="modal-close-wrapper-mobile">' +
                                            '<div class="modal-close-wrapper-mobile-inner">' +
                                                '<a href="" class="modal-close icon-close">Close</a>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="modal-body">' +
                                            '<div class="modal-dialog-inner modal-dialog-inner-body">' +
                                                '<h1>{{title}}</h1>' +
                                                '<div>{{content}}</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>';

            var trigger = '<a class="modal-trigger" id="ajax-form-modal-trigger" data-modal="#ajax-form-modal"></a>',
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
                ajaxProxy = function(action, $form, cb) {

                    var enctype = $form.attr('enctype') ? $form.attr('enctype') : 'application/x-www-form-urlencoded',
                        method = $form.attr('method') ? $form.attr('method') : 'get';

                    if (enctype == 'multipart/form-data') {

                        // setup
                        var $target = $('#' + $form.attr('target'));

                        // override listener
                        $target[0].onload = function() {
                            cb($target.contents().find("body").html(), 'success');
                        };

                    }
                    else $[method](action, $form.serialize(), cb);
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
                            title = $this.attr('data-success-title'),
                            msgFail = $this.attr('data-fail-message'),
                            titleFail = $this.attr('data-fail-title'),
                            $template = $(trigger + template.replace(/\{\{title\}\}/, title).replace(/\{\{content\}\}/, msg)),
                            disabledClass = $this.attr('data-disabled-class') || 'disabled',
                            maxSubmissions = $this.attr('data-max-submissions'),
                            disabled =  $this.is('.' + disabledClass),
                            submissionCount = $this.attr('data-submission-count') || 0,
                            method = $this.attr('method') ? $this.attr('method') : 'get',
                            validate = $this.is('[data-validate]'),
                            validateOnly = $this.attr('data-ajax-validate-only') || null;

                        if (
                            !$('html').is('.loading') &&
                            !disabled &&
                            (maxSubmissions == undefined || parseInt(submissionCount) < parseInt(maxSubmissions)) &&
                            (!validate || (validate && $this.validator('validate', validateOnly)))
                        ) {
                            $('html').addClass('loading');
                            ajaxProxy($this.attr('action'), $this, function(data, textStatus, jqXHR) {

                                if (replace == undefined) $form.html($($(data).find(selector)[idx]).html());
                                else $(replace).html($(data).find(replace).html());

                                ajaxForms(selector, cb);

                                if (typeof picturefill == 'function') picturefill();
                                if (typeof cb == 'function') cb($this, data);

                                $this.attr('data-submission-count', submissionCount + 1);
                                if (maxSubmissions != undefined && submissionCount + 1 >= maxSubmissions) $this.addClass(disabledClass);
                                $('html').removeClass('loading');

                                if (scrollTo != undefined)
                                    $('html, body, .body').animate({
                                        scrollTop: $(scrollTo).offset().top
                                    }, 600);

                                if (textStatus == 'success' && successTestCb(data, textStatus, jqXHR)) {
                                    if (msg != undefined) {
                                        $body.append($template);
                                        modals();
                                        $('#ajax-form-modal-trigger').trigger('tap');
                                        $('.modal-close, .body-overlay').on('tap',function(e) { $template.remove(); });
                                    }
                                } else {
                                    if (msgFail != undefined) {
                                        $body.append($templateFail);
                                        modals();
                                        $('#ajax-form-modal-trigger').trigger('tap');
                                        $('.modal-close, .body-overlay').on('tap',function(e) { $templateFail.remove(); });
                                    }
                                }
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
                                !$('html').is('.loading') &&
                                !disabled &&
                                (maxSubmissions == undefined || parseInt(submissionCount) < parseInt(maxSubmissions)) &&
                                (!validate || (validate && $this.closest('form').validator('validate', validateOnly)))
                            ) {
                                $('html').addClass('loading');
                                ajaxProxy($this.attr('action'), $form, function(data, textStatus, jqXHR) {

                                    if (replace == undefined) $form.html($($(data).find(selector)[idx]).html());
                                    else $(replace).html($(data).find(replace).html());

                                    ajaxForms(selector, cb);

                                    if (typeof picturefill == 'function') picturefill();
                                    if (typeof cb == 'function') cb($this, data);

                                    if (maxSubmissions != undefined && submissionCount + 1 >= maxSubmissions) $this.addClass(disabledClass);
                                    $('html').removeClass('loading');

                                    if (scrollTo != undefined)
                                        $('html, body. .body').animate({
                                            scrollTop: $(scrollTo).offset().top
                                        }, 600);

                                    if (textStatus == 'success' && successTestCb(data, textStatus, jqXHR)) {
                                        if (msg != undefined) {
                                            $body.append($template);
                                            modals();
                                            $('#ajax-form-modal-trigger').trigger('tap');
                                            $('.modal-close, .body-overlay').on('tap',function(e) { $template.remove(); });
                                        }
                                    } else {
                                        if (msgFail != undefined) {
                                            $body.append($templateFail);
                                            modals();
                                            $('#ajax-form-modal-trigger').trigger('tap');
                                            $('.modal-close, .body-overlay').on('tap',function(e) { $templateFail.remove(); });
                                        }
                                    }

                                });
                            }
                        });
            })
        });
    };

    return ajaxForms;
}));
