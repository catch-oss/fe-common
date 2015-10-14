define([
    'jquery',
    'app/scope',
    'masterlib/scope'
], function ($, app, twoDegrees) {

    'use strict';

    return function(selector, cb) {

        selector = selector || '.ss-ajax-form';

        twoDegrees.ajaxForms(
            selector,
            function () {
                twoDegrees.confirm();
                twoDegrees.dropDowns();
                twoDegrees.tabs();
                twoDegrees.accordion();
                twoDegrees.alerts();
                twoDegrees.typeahead();
                twoDegrees.floatLabels();
                twoDegrees.formValidation();
                twoDegrees.ajaxModals();
                twoDegrees.forms();
                $('form .alert').remove(); // remove the message from the form
                if (typeof cb == 'function') cb();
            },
            'two-degrees',
            function (data) {

                var case1 = $(data).find('.error-list.filled').length === 0,
                    case2 = $(data).find('.form-group.error').length === 0;

                return case1 && case2;
            }
        );
    };
});
