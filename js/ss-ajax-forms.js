;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define(
            [
                'jquery',
                './ajaxForms',
                './dropDowns',
                './placeholders',
                './floatLabels',
                './formValidation'
            ],
            factory
        );

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery'),
            require('./ajaxForms'),
            require('./dropDowns'),
            require('./placeholders'),
            require('./floatLabels'),
            require('./formValidation')
        );

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.ssAjaxForms = factory(
            root.jQuery,
            root.catch.ajaxForms,
            root.catch.dropDowns,
            root.catch.placeholders,
            root.catch.floatLabels,
            root.catch.formValidation
        );
    }

}(this, function ($, ajaxForms, dropDowns, placeholders, floatLabels, formValidation) {

    'use strict';

    /**
     * returns a function that will bind to the forms generated by ss-masterlib-forms
     * @param  {String}  selector [description]
     * @param  {Function} cb       [description]
     * @return {void}
     */
    return function() {

        var conf = arguments[0];

        // handle old syntax
        // selector, cb
        if (typeof conf != 'object') {
            conf = {
                selector: arguments[0],
                onAfterRequest: arguments[1],
                onBeforeRequest: arguments[2],
                bindDefaultFormModules: arguments[3]
            }
        }

        // handle args
        var selector = conf.selector || '.ss-ajax-form',
            onAfterRequest = conf.onAfterRequest || null,
            onBeforeRequest = conf.onBeforeRequest || null,
            bindDefaultFormModules = conf.bindDefaultFormModules === undefined ? true : conf.bindDefaultFormModules;

        // ajax forms it
        ajaxForms({
            selector: selector,
            namespace: 'ss-ajax',
            onBeforeRequest: function($form) {

                // hide the form modal if the form is in one
                var $modal = $form.closest('#ajax-modal-modal');
                if ($modal.length) {
                    $modal.addClass('hidden');
                }

                // lifecycle callbacks
                if (typeof onBeforeRequest == 'function') onBeforeRequest();
            },
            onAfterCloseResultModal: function($form, result) {

                // hide the form modal if the form is in one
                var $modal = $form.closest('#ajax-modal-modal');
                if ($modal.length) {
                    if (result.success) {
                        $modal.find('.modal-close').trigger('click');
                    }
                }
            },
            onAfterRequest: function($form) {

                if (bindDefaultFormModules) {

                    // attach the form stuf
                    dropDowns.formSelect({touchBody: false});
                    placeholders();
                    floatLabels();

                    // sort the validators
                    if (typeof $form.validator == 'function') $form.validator('destroy');
                    formValidation();
                }

                // handle messaging
                var $alert = $form.find('.alert');
                if ($alert.length) {
                    $form.attr(
                        $alert.is('.error') ? 'data-fail-message' : 'data-success-message',
                        $alert.html()
                    )
                }
                $('form .alert').remove(); // remove the message from the form

                // forward if it is desired
                if ($('[data-forward]').length) {
                    setTimeout(function() {
                        window.location = $('[data-forward]').attr('data-forward');
                    }, 5000);
                }

                // lifecycle callbacks
                if (typeof onAfterRequest == 'function') onAfterRequest();
            },
            successTestCb: function(data) {

                var case1 = $(data).find('.error-list.filled').length === 0,
                    case2 = $(data).find('.form-group.error').length === 0,
                    case3 = $(data).find('.alert-error').length === 0;

                return case1 && case2 && case3;
            },
        });
    };
}))
