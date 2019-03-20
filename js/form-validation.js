/**
 * The pupose of this is to provide a library agnostic interface for
 * whatever js library we want to use to handle the validation
 * currently for the most part we are using parsely
 * validation requires that you attach an attribute to the form of `data-validate`
 * each of the validators in the list below you put on an element in the form of `data-validate-{validator}`
 * e.g. <form data-validate><input name="firstname" data-validate-required></form>
 *
 */

// When this is reintegrated to the 2d masterlib we need to init it with:
// window.catch.formValidation(function(){ return twoDegrees.dockNav('height'); });

 ;(function (root, factory) {

     // AMD. Register as an anonymous module depending on jQuery.
     if (typeof define === 'function' && define.amd)
        define(
            [
                'jquery',
                'moment',
                './validators',
                './dock-nav',
                './../../parsleyjs/dist/parsley',
                './../../body-toucher/body-toucher'
            ],
            factory
        );

     // Node, CommonJS-like
     else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery'),
            require('./../../moment/moment'),
            require('./validators'),
            require('./dock-nav'),
            require('./../../parsleyjs/dist/parsley'),
            require('./../../body-toucher/body-toucher')
        );

     // Browser globals (root is window)
     else {
        root.catch = (root.catch || {});
        root.catch.formValidation = factory(
            root.jQuery,
            root.moment,
            root.catch.validators,
            root.catch.dockNav
        );
     }

}(this, function ($, moment, vLib, dockNav, parsley, bodyToucher, undefined) {

    return function(conf) {

        // opts
        var opts = typeof conf == 'object' ? conf : {};

        // backwards compatible...
        if (typeof conf == 'string' || typeof opts == 'number' || typeof opts == 'function')
            opts.docNavHeight = conf;

        // defaults
        opts.docNavHeight = opts.docNavHeight === undefined ? 0 : opts.docNavHeight;
        opts.animateScroll = opts.animateScroll === undefined ? true : opts.animateScroll;
        opts.errorClass = opts.errorClass || 'error';
        opts.errorsWrapper = opts.errorsWrapper || '<ul class="error-list"></ul>';
        opts.fieldWrapper = opts.fieldWrapper || '.m-form-field';
        opts.fieldErrorWrapperClass = opts.fieldErrorWrapperClass || 'error';
        opts.floatLabelWrapper = opts.floatLabelWrapper || '.floatlabel-wrapper';

        $(function() {

            // define global options
            var globalOpts = {
                errorClass: opts.errorClass,
                errorsWrapper: opts.errorsWrapper,
                namespace: 'data-validate-'
            };

            // set the global opts
            window.Parsley.options = $.extend({}, window.Parsley.options, globalOpts);

            // create the validator plugin interface
            $.fn.validator = function(options, args) {
                var $this = this.length === undefined ? $(this) : this;
                if ($this.length) {
                    if (options == 'validate') return $this.parsley().validate(args);
                    if (options == 'destroy') return $this.parsley().destroy();
                    if (options == 'isValid') return $this.parsley().isValid(args);
                    if (options == 'whenValid') return $this.parsley().whenValid(args);
                }
                return $this.parsley();
            };

            var megaSelector,
                i,
                ns = 'data-validate', // this is the parsley namespace
                validators = {

                    // validates passowrd strength
                    'passwordstrength'      : {attrName: ns + '-passwordstrength',       attrVal: null,          extraAttrs: []},

                    // Validate that a required field has been filled with a non blank value. - if set to false it will deactivate
                    'required'              : {attrName: ns + '-required',               attrVal: undefined,     extraAttrs: []},

                    // Validates that a value is a valid email address.
                    'email'                 : {attrName: ns + '-type',                   attrVal: 'email',       extraAttrs: []},

                    // Validates that a value is a valid number
                    'number'                : {attrName: ns + '-type',                   attrVal: 'number',      extraAttrs: []},

                    // Validates that a value is a valid integer.
                    'integer'               : {attrName: ns + '-type',                   attrVal: 'integer',     extraAttrs: []},

                    // Validates that a value is only digits.
                    'digits'                : {attrName: ns + '-type',                   attrVal: 'digits',      extraAttrs: []},

                    // Validates that a value is a valid alphanumeric string
                    'alphanum'              : {attrName: ns + '-type',                   attrVal: 'alphanum',    extraAttrs: []},

                    // Validates that a value is a valid url.
                    'url'                   : {attrName: ns + '-type',                   attrVal: 'url',         extraAttrs: []},

                    // Validates that the length of a string is at least as long as the given limit.
                    'minlength'             : {attrName: ns + '-minlength',              attrVal: undefined,     extraAttrs: []},

                    // Validates that the length of a string is not larger than the given limit.
                    'maxlength'             : {attrName: ns + '-maxlength',              attrVal: undefined,     extraAttrs: []},

                    // Validates that a given string length is between some minimum and maximum value. e.g. [6, 10]
                    'length'                : {attrName: ns + '-length',                 attrVal: undefined,     extraAttrs: []},

                    // Validates that a given number is greater than some minimum number.
                    'min'                   : {attrName: ns + '-min',                    attrVal: undefined,     extraAttrs: []},

                    // Validates that a given number is between some minimum and maximum number.
                    'max'                   : {attrName: ns + '-max',                    attrVal: undefined,     extraAttrs: []},

                    // Validates that a given number is between some minimum and maximum number. e.g. [6,10]
                    'range'                 : {attrName: ns + '-range',                  attrVal: undefined,     extraAttrs: []},

                    // Validates that a value matches a specific regular expression (regex).
                    'pattern'               : {attrName: ns + '-pattern',                attrVal: undefined,     extraAttrs: []},

                    // Validates that a certain minimum number of checkboxes in a group are checked.
                    'mincheck'              : {attrName: ns + '-mincheck',               attrVal: undefined,     extraAttrs: []},

                    // Validates that a certain maximum number of checkboxes in a group are checked.
                    'maxcheck'              : {attrName: ns + '-maxcheck',               attrVal: undefined,     extraAttrs: []},

                    // Validates that the number of checked checkboxes in a group is within a certain range. e.g. [1, 3]
                    'check'                 : {attrName: ns + '-check',                  attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to another field value (useful for password confirmation check).
                    'equalto'               : {attrName: ns + '-equalto',                attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to another field value (useful for password confirmation check).
                    'requiredif'            : {attrName: ns + '-requiredif',             attrVal: undefined,     extraAttrs: [[ns + '-validate-if-empty', true]]},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'equals'                : {attrName: ns + '-equals',                 attrVal: undefined,     extraAttrs: []},

                    // Validates that another field's value is identical to a supplied value (useful for using hidden input values in validation logic and displaying them in context with an assciated field).
                    'otherfieldequals'      : {attrName: ns + '-otherfieldequals',       attrVal: undefined,     extraAttrs: []},

                    // Validates that another field's value is identical to a supplied value conditionally (useful for using hidden input values in validation logic and displaying them in context with an assciated field).
                    'otherfieldequalsif'    : {attrName: ns + '-otherfieldequalsif',     attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'equalsif'              : {attrName: ns + '-equalsif',               attrVal: undefined,     extraAttrs: []},

                    // Validates that a given number is greater than some minimum number.
                    'minif'                 : {attrName: ns + '-minif',                  attrVal: undefined,     extraAttrs: []},

                    // Validates that a given number is smaller than some maximum number.
                    'maxif'                 : {attrName: ns + '-maxif',                  attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'patternif'             : {attrName: ns + '-patternif',              attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'bankaccount'           : {attrName: ns + '-bankaccount',            attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'creditcard'            : {attrName: ns + '-creditcard',             attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is a date
                    'validdate'             : {attrName: ns + '-validdate',              attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is a future date
                    'futuredate'            : {attrName: ns + '-futuredate',             attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is a past date
                    'pastdate'              : {attrName: ns + '-pastdate',               attrVal: undefined,     extraAttrs: []},

                    // Validates that a multiple input date is in the future
                    'futuredatecomponent'   : {attrName: ns + '-futuredatecomponent',    attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'creditcardif'          : {attrName: ns + '-creditcardif',           attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'cvc'                   : {attrName: ns + '-cvc',                    attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'cvcif'                 : {attrName: ns + '-cvcif',                  attrVal: undefined,     extraAttrs: []},

                    // Validates that a remote url returns a 2XX response code
                    'remote'                : {attrName: ns + '-remote',                 attrVal: undefined,     extraAttrs: []},

                    // Validates that a remote url returns a 4xx response code
                    'remote-reverse'        : {attrName: ns + '-remote-reverse',         attrVal: undefined,     extraAttrs: []}

                },
                modifiers = {

                    // defines a way of grouping validators
                    'group'                 : {attrName: ns + '-group',                  attrVal: undefined},

                    // json object to be used by the remote
                    'remote-options'        : {attrName: ns + '-remote-options',         attrVal: undefined},

                    // a boolean to indicate if the validation should be triggered even with an empty value
                    'if-empty'              : {attrName: ns + '-validate-if-empty',      attrVal: undefined},

                    // Specify one or many javascript events that will trigger item validation. To set multiple events, separate them by a space data-validate-trigger="focusin focusout". See the various events supported by jQuery.
                    'trigger'               : {attrName: ns + '-trigger',                attrVal: undefined},

                    // If this field fails, do not focus on it (if first focus strategy is on, next field would be focused, if last strategy is on, previous field would be focused)
                    'no-focus'              : {attrName: ns + '-no-focus',               attrVal: undefined},

                    // Used with trigger option above, for all key- events, do not validate until field have a certain number of characters. Default is 3
                    'validation-threshold'  : {attrName: ns + '-validation-threshold',   attrVal: undefined},

                    // Specify the existing DOM container where ParsleyUI should add error and success classes. It is also possible to configure it with a callback function from javascript, see the annotated source.
                    'class-handler'         : {attrName: ns + '-class-handler',          attrVal: undefined},

                    // Specify the existing DOM container where ParsleyUI should put the errors. It is also possible to configure it with a callback function from javascript, see the annotated source.
                    'errors-container'      : {attrName: ns + '-errors-container',       attrVal: undefined},

                    // Customize a unique global message for the field.
                    'error-message'         : {attrName: ns + '-error-message',          attrVal: undefined},

                    // constraint specific message
                    '*-message'             : {attrName: ns + '-*-message',              attrVal: undefined}
                };

            // Custom validators
            // -----------------

            // date component validator
            // e.g.
            // data-validate-futuredatecomponent="#year,YY,#month,MM,#day,DD"
            window.ParsleyValidator
                .addValidator('futuredatecomponent', vLib.futuredatecomponent, 32)
                .addMessage('en', 'futuredatecomponent', 'This date is in the past.');

            // pastdate
            // e.g.
            // data-validate-pastdate="YYYY-MM-DD"
            window.ParsleyValidator
                .addValidator('pastdate', vLib.pastdate, 32)
                .addMessage('en', 'pastdate', 'This date is in the future.');

            // pastdate
            // e.g.
            // data-validate-pastdate="YYYY-MM-DD"
            window.ParsleyValidator
                .addValidator('validdate', vLib.validdate, 32)
                .addMessage('en', 'validdate', 'This is not a valid date.');

            // futuredate
            // e.g.
            // data-validate-futuredate="YYYY-MM-DD"
            window.ParsleyValidator
                .addValidator('futuredate', vLib.futuredate, 32)
                .addMessage('en', 'futuredate', 'This date is in the past.');

            // Required If
            // attr val should follow this syntax {selector},{comparison operator},{value to compare}
            window.ParsleyValidator
                .addValidator('requiredif', vLib.requiredif, 512)
                .addMessage('en', 'requiredif', 'This value is required.');

            // min if
            window.ParsleyValidator
                .addValidator('minif', vLib.minif, 32)
                .addMessage('en', 'minif', 'This value is too small.');

            // max if
            window.ParsleyValidator
                .addValidator('maxif', vLib.maxif, 32)
                .addMessage('en', 'maxif', 'This value is too large.');

            // bank account
            window.ParsleyValidator
                .addValidator('bankaccount', vLib.bankaccount, 32)
                .addMessage('en', 'bankaccount', 'Please provide a valid bank account number');

            // cc
            window.ParsleyValidator
                .addValidator('creditcard', vLib.creditcard, 32)
                .addMessage('en', 'creditcard', 'Please provide a valid credit card number');

            // cc if
            window.ParsleyValidator
                .addValidator('creditcardif', vLib.creditcardif, 32)
                .addMessage('en', 'creditcardif', 'Please provide a valid credit card number');

            // cvc
            // e.g.
            // data-validate-cvc="#ccInputSelector"
            window.ParsleyValidator
                .addValidator('cvc', vLib.cvc, 32)
                .addMessage('en', 'cvc', 'This CVC is invalid for the provided credit card');

            // cvc
            // e.g.
            // data-validate-cvc="#ccInputSelector,input:radio[name=paymentMethod]:checked,==,'cc'"
            window.ParsleyValidator
                .addValidator('cvcif', vLib.cvcif, 32)
                .addMessage('en', 'cvcif', 'This CVC is invalid for the provided credit card');

            // min if
            window.ParsleyValidator
                .addValidator('patternif', vLib.patternif, 32)
                .addMessage('en', 'patternif', 'Please provide a valid value.');

            // Equals
            window.ParsleyValidator
                .addValidator('equals', vLib.equals, 32)
                .addMessage('en', 'equals', 'This value is invalid.');

            // validates that another field equals something
            window.ParsleyValidator
                .addValidator('otherfieldequals', vLib.otherfieldequals, 32)
                .addMessage('en', 'otherfieldequals', 'This value is invalid.');

            // NotEquals
            window.ParsleyValidator
                .addValidator('notequalsfield', vLib.otherfieldnotequals, 32)
                .addMessage('en', 'notequalsfield', 'This value is invalid.');

            // validates that another field equals something conditionally
            window.ParsleyValidator
                .addValidator('otherfieldequalsif', vLib.otherfieldequalsif, 32)
                .addMessage('en', 'otherfieldequalsif', 'This value is invalid.');

            // Equals If
            // conditional version of equals
            // attr val should follow this syntax {value},{selector},{comparison operator},{value to compare}
            window.ParsleyValidator
                .addValidator('equalsif', vLib.equalsif, 32)
                .addMessage('en', 'equalsif', 'This value is invalid');

            // Password strength
            window.ParsleyValidator
                .addValidator('passwordstrength', vLib.passwordstrength, 32)
                .addMessage('en', 'passwordstrength', 'Password must contain numbers and letters and be longer than 5 characters.');

            // Apply to the forms
            // ------------------

            // compile the selector
            for (i in validators) {
                if (megaSelector) megaSelector += ',';
                megaSelector += '[data-validate-' + i + ']';
            }

            $('form').each(function(idx) {

                var $form = $(this);

                // if we want to validate this form then....
                if ($form.is('form[data-validate]')) {

                    // find all the elements and fuck with them
                    $form.find(megaSelector).each(function(eIdx) {

                        var $elem = $(this),
                            validator,
                            modifier,
                            attrVal,
                            im,
                            ia,
                            i;

                        for (i in validators) {

                            // apply validator
                            validator = validators[i];
                            if ($elem.is('[data-validate-' + i + ']')) {

                                // handle base attr
                                attrVal = validator.attrVal;
                                if (validator.attrVal == undefined) attrVal = $elem.attr('data-validate-' + i);
                                $elem.attr(validator.attrName, attrVal);

                                // apply extra attrs
                                for (ia=0; ia < validator.extraAttrs.length; ia++) {
                                    $elem.attr(validator.extraAttrs[ia][0], validator.extraAttrs[ia][1]);
                                }
                            }

                            // expand modifiers
                            for (im in modifiers) {
                                if (im.indexOf('*') != -1) {
                                    modifier = modifiers[im];
                                    modifiers[im.replace(/\*/, i)] = {attrName: modifier.attrName.replace(/\*/, i), attrVal: modifier.attrVal}
                                }
                            }
                        }

                        // apply modifiers
                        for (i in modifiers) {
                            modifier = modifiers[i];
                            if (i.indexOf('*') == -1) {
                                if ($elem.is('[data-validate-' + i + ']')) {
                                    attrVal = modifier.attrVal;
                                    if (modifier.attrVal == undefined) attrVal = $elem.attr('data-validate-' + i);
                                    $elem.attr(modifier.attrName, attrVal);
                                }
                            }
                        }
                    });

                    // init
                    if ($form.parsley != undefined) {

                        $form.parsley({namespace: ns + '-'});

                        // we need to re map some stuff so as to allow for server errors to be passed through synchronously
                        // this should really be replaced with remote validators
                        $($form[0].elements).each(function() {

                            var $elem = $(this),
                                $parsley = $elem.parsley(),
                                $container = $($elem.attr('data-validate-errors-container')),
                                $correctContainer = $('#parsley-id-' + $elem.attr(ns + '-id'));

                            if ($parsley.off !== undefined)
                                $parsley
                                    .off('field:error')
                                    .on('field:error', function(el) {

                                        // ensure the elem has an error
                                        el.$element
                                            .addClass(opts.errorClass)
                                            .closest(opts.floatLabelWrapper)
                                                .addClass(opts.errorClass)
                                                .end()
                                                .closest(opts.fieldWrapper)
                                                    .addClass(opts.fieldErrorWrapperClass);

                                        // handle server supplied errors
                                        if ($elem.is('[data-validate-errors-container]'))
                                            setTimeout(function() {
                                                $correctContainer.find('li').each(function(idx) {

                                                    // pre vars
                                                    var cls = $(this).attr('class'),
                                                        $all = $correctContainer.find('[class="' + cls + '"]'),
                                                        keep = $all.length ? $all[0].outerHTML : '';

                                                    // console.log(cls, $all.length, $all, keep);

                                                    // keep the first one and remove the rest
                                                    if ($all.length > 1) {
                                                        $all.remove();
                                                        $correctContainer.append(keep);
                                                    }

                                                });
                                            });

                                    })
                                    .off('field:success')
                                    .on('field:success', function(el) {

                                        // remove error classes
                                        el.$element
                                            .removeClass(opts.errorClass)
                                            .closest(opts.floatLabelWrapper)
                                                .removeClass(opts.errorClass)
                                                .end()
                                                .closest(opts.fieldWrapper)
                                                    .removeClass(opts.fieldErrorWrapperClass);

                                        // handle server supplied errors
                                        if ($elem.is('[data-validate-errors-container]'))
                                            $correctContainer.removeClass('filled').find('li').remove();

                                    });
                        });

                        // we need to re map some stuff so as to allow for server errors to be passed through synchronously
                        // this should really be replaced with remote validators
                        $form.find('[data-validate-errors-container]').each(function(){

                            var $elem = $(this),
                                $container = $($elem.attr('data-validate-errors-container')),
                                $correctContainer = $('#parsley-id-' + $elem.attr(ns + '-id')),
                                $children = $container.find('.error-list').children();

                            // move the errors to the right location
                            $correctContainer.append($children.detach());

                            // if there's errors
                            if ($children.length) {

                                // make sure the correct classes are added
                                $correctContainer.addClass('filled');

                                // remove bad stuff
                                $container.find('.error-list').each(function(){
                                    if (!$(this).is($correctContainer)) $(this).remove();
                                });

                                // make sure the right classes are in place
                                $elem
                                    .addClass(opts.errorClass)
                                    .closest(opts.floatLabelWrapper)
                                        .addClass(opts.errorClass)
                                        .end()
                                        .closest(opts.fieldWrapper)
                                            .addClass(opts.fieldErrorWrapperClass);
                            }
                        });

                        // add classes to form once it's validated
                        $form.parsley()
                            .off('form:validated')
                            .on('form:validated', function(){
                                $form.addClass('validator-validated');
                            });

                        // handle conflict with sticky nav
                        $form.parsley()
                            .off('form:error')
                            .on('form:error', function() {

                                // don't scroll on error
                                if (!$form.is('.m-form--no-scroll-on-error, .m-form_no-scroll-on-error, .js-no-scroll-on-error')) {

                                    var $el = $('input.error, select:not(.catch-dropdown).error, select.catch-dropdown.error + label, textarea.error').first(),
                                        $scrollElem = $.scrollElem(true),
                                        clearHeight = dockNav('height');

                                    // console.log($el.offsetTop() - clearHeight);
                                    // console.log($scrollElem);

                                    setTimeout(function() {
                                        if ($el.length) {
                                            $scrollElem.animate({ scrollTop: $el.offsetTop() - clearHeight }, 400);
                                            $el.focus();
                                        }
                                    });
                                }
                            });
                    }
                }
            });
        });
    };
}));
