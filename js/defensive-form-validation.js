;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define(
            [
                'jquery',
                './form-validation'
            ],
            factory
        );

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery'),
            require('./form-validation')
        );

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.defensiveFormValidation = factory(root.jQuery);
    }

}(this, function ($, formValidation, undefined) {

    'use strict';

    return function(conf) {

        conf = conf || {};
        conf.formValidationConf = conf.formValidationConf || {};
        conf.selector = conf.selector || '.js-defensive-form-validation';
        conf.submitSelector = conf.submitSelector || '.js-form-submit, button, input[type="submit"]';
        conf.disabledClass = conf.disabledClass || 's-disabled';
        conf.validCB = conf.validCB || function($els) {
            $els.prop('disabled', false)
                .removeAttr('disabled')
                .removeClass(conf.disabledClass);
        };
        conf.invalidCB = conf.invalidCB || function($els) {
            $els.prop('disabled', true)
                .attr('disabled', 'disabled')
                .addClass(conf.disabledClass);
        };

        formValidation(conf.formValidationConf);

        $(function() {

            $(conf.selector).each(function() {

                var $form = $(this);

                $form
                    .find('input, select, textarea')
                        .off('click.defensive')
                        .off('change.defensive')
                        .off('keyup.defensive')
                        .off('nochange.defensive')
                        .on('click.defensive, change.defensive, keyup.defensive, nochange.defensive', function() {

                            if (typeof conf.validCB == 'function')
                                conf.invalidCB($form.find(conf.submitSelector))

                            $form.validator('whenValid')
                                .done(function() {

                                    if (typeof conf.validCB == 'function')
                                        conf.validCB($form.find(conf.submitSelector))
                                })
                                .fail(function() {

                                    if (typeof conf.invalidCB == 'function')
                                        conf.invalidCB($form.find(conf.submitSelector))
                                });
                        })
                        .trigger('nochange');

            });
        });
    };
}));
