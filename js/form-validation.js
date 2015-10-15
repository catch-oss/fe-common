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
     if (typeof define === 'function' && define.amd) define(['jquery', './../../parsleyjs/dist/parsley', './../../body-toucher/body-toucher'], factory);

     // Node, CommonJS-like
     else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../../parsleyjs/dist/parsley'), require('./../../body-toucher/body-toucher'));

     // Browser globals (root is window)
     else {
         root.catch = (root.catch || {});
         root.catch.formValidation = factory(root.jQuery);
     }

}(this, function ($, undefined) {

    return function(docNavHeight) {

        // fall back to using a sticky nav clear of 0
        docNavHeight = docNavHeight || 0;

        $(function() {

            // error template
            window.ParsleyConfig = {
                errorClass: 'error',
                errorsWrapper: '<ul class="error-list"></ul>'
            };

            // create the validator plugin interface
            $.fn.validator = function(options, args) {
                if (options == 'validate') return $(this).parsley().validate(args);
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
                    'requiredif'            : {attrName: ns + '-requiredif',             attrVal: undefined,     extraAttrs: [[ns + '-validate-if-empty',true]]},

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

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'patternif'             : {attrName: ns + '-patternif',              attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'bankaccount'           : {attrName: ns + '-bankaccount',            attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'creditcard'            : {attrName: ns + '-creditcard',             attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'futuredatecomponent'   : {attrName: ns + '-futuredatecomponent',    attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'creditcardif'          : {attrName: ns + '-creditcardif',           attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'cvc'                   : {attrName: ns + '-cvc',                    attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'cvcif'                 : {attrName: ns + '-cvcif',                  attrVal: undefined,     extraAttrs: []},

                    // Validates that the value is identical to a supplied value (useful for validating acceptance).
                    'login'                 : {attrName: ns + '-login',                  attrVal: undefined,     extraAttrs: []},

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


            // Validation Helpers
            // ------------------

            var testCondition = function(requirement) {
                var a = typeof requirement == 'string' ? parseCSV(requirement) : requirement,
                    required = '',
                    join,
                    compareTo,
                    i,
                    iBase,
                    iSelector,
                    iComparison,
                    iValue,
                    iConditionJoin;

                for (i=0; i < Math.ceil(a.length / 4); i++) {
                    iBase = (i * 4);
                    iConditionJoin = iBase - 1;
                    iSelector = iBase;
                    iComparison = iBase + 1;
                    iValue = iBase + 2;
                    join = typeof a[iConditionJoin] == 'undefined' ? '' :  a[iConditionJoin];
                    compareTo = a[iValue].trim();

                    // check the value to see if it's a special case otherwise wrap it in quotes so it gets treated as a string
                    // this is a little bit of a hack because we are using this csv parser which strips the quotes
                    if (compareTo != 'false' && compareTo != 'true' && compareTo != 'null' && !/^[0-9]+$/.test(compareTo))
                        compareTo = "'" + compareTo + "'";

                    // append to the conditional string
                    required += join + " $('" + a[iSelector].trim() + "').val() " + a[iComparison].trim() + " " + compareTo;

                }

                // evaluate the conditional
                return eval(required);
            }

            var parseCSV = function(text) {
                var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
                var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
                // Return NULL if input string is not well formed CSV string.
                if (!re_valid.test(text)) return null;
                var a = [];                     // Initialize array to receive values.
                text.replace(re_value, // "Walk" the string using replace with callback.
                    function(m0, m1, m2, m3) {
                        // Remove backslash from \' in single quoted values.
                        if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                        // Remove backslash from \" in double quoted values.
                        else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                        else if (m3 !== undefined) a.push(m3);
                        return ''; // Return empty string.
                    });
                // Handle special case of empty last value.
                if (/,\s*$/.test(text)) a.push('');
                return a;
            };

            // alt validateCC
            // var validateCC = (function (arr) {
            //     return function (ccNum) {
            //         var len = ccNum.length,
            //             bit = 1,
            //             sum = 0,
            //             val;
            //
            //         while (len) {
            //             val = parseInt(ccNum.charAt(--len), 10);
            //             sum += (bit ^= 1) ? arr[val] : val;
            //         }
            //
            //         return sum && sum % 10 === 0;
            //     };
            // }([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));

            // // test numbers
            // var testNums =[
            //     // VISA
            //     '4556989767797289',
            //     '4716286343187425',
            //     '4716134755663295',
            //     // MasterCard
            //     '5594758336220631',
            //     '5390499921566486',
            //     '5108625906075282',
            //     // American Express (AMEX)
            //     '347626171431350',
            //     '372108327916855',
            //     '342869405374682',
            //     // Discover
            //     '6011269463068671',
            //     '6011675829701773',
            //     '6011224226154839',
            //     // JCB
            //     '3112815901743302',
            //     '3088332500627548',
            //     '3088959273802666',
            //     // Diners Club - North America
            //     '5401737668539886',
            //     '5495588809349181',
            //     '5413845858032541',
            //     // Diners Club - Carte Blanche
            //     '30559662066702',
            //     '30117783673466',
            //     '30055647722675',
            //     // Diners Club - International
            //     '36664841825202',
            //     '36835616453269',
            //     '36189377506000',
            //     // Maestro
            //     '5018720630326868',
            //     '5018349026270207',
            //     '5020458407283667',
            //     // LASER
            //     '6304593419770189',
            //     '6709985310482115',
            //     '6771875407804953',
            //     // Visa Electron
            //     '4175000800486194',
            //     '4508805392562758',
            //     '4917443126057195',
            //     // InstaPayment
            //     '6388236882589111',
            //     '6384157170813043',
            //     '6399596923972791',
            // ];

            var validateCC = function(value) {

                var first       = String(value.charAt(0)),
                    firstTwo    = first + String(value.charAt(1)),
                    firstThree  = firstTwo + String(value.charAt(2)),
                    firstFour   = firstThree + String(value.charAt(3)),
                    isMC        = ['51','52','53','54','55'].indexOf(firstTwo) > -1,
                    isVisa      = ['4'].indexOf(first) > -1,
                    isDinersCB  = ['300','301','302','303','304','305'].indexOf(firstThree) > -1,
                    isDinersInt = ['36'].indexOf(firstTwo) > -1,
                    isAE        = ['34','37'].indexOf(firstTwo) > -1,
                    isLaser     = ['6304','6706','6771','6709'].indexOf(firstFour) > -1,
                    isMaestro   = ['5018','5020','5038','5893','6304','6759','6761','6762','6763'].indexOf(firstFour) > -1,
                    sum         = 0,
                    numdigits   = value.length,
                    parity      = numdigits % 2,
                    digit, i;

                // black list some card providers at request of 2dbb
                if (isDinersCB || isDinersInt || isLaser || isMaestro) return false;

                // validate length
                if (isVisa && (numdigits < 13 || numdigits > 16)) return false;
                else if ((isMC || isLaser || isMaestro) && (numdigits < 16 || numdigits > 19)) return false;
                else if ((isDinersCB || isDinersInt) && numdigits != 14) return false;
                else if (isAE && numdigits != 15) return false;
                else if ((!isMC && !isVisa && !isDinersCB && !isDinersInt && !isAE && !isLaser && !isMaestro) && numdigits != 16) return false;

                // luhns
                for (i=0; i < numdigits; i++) {
                    digit = parseInt(value.charAt(i))
                    if (i % 2 == parity) digit *= 2;
                    if(digit > 9) digit -= 9;
                    sum += digit;
                }
                return (sum % 10) == 0;
            };

            var validateCVC = function(value, ccNum) {

                var firstTwo    = first + String(ccNum.charAt(0) + ccNum.charAt(1)),
                    isAE        = ['34','37'].indexOf(firstTwo) > -1;

                // validate length
                return isAE ? /^\d{4}$/.test(value) : /^\d{3}$/.test(value);
            };

            // Custom validators
            // -----------------

            // What would be really awesome is if instead of creating all these supplimentary conditional validators that we
            // created something like ns-validate-if-empty called ns-validate-if and then used the all the built in validators

            // date validator
            // window.ParsleyValidator
            //     .addValidator('future-date', function (value, requirement) {
            //
            //         var a = parseCSV(requirement),
            //             cmp = a.shift();
            //
            //     }, 32)
            //     .addMessage('en', 'login', 'Please enter a valid email or mobile number.');

            // date component validator
            // e.g.
            // data-validate-futuredatecomponent="#year,YY,#month,MM,#day,DD"
            window.ParsleyValidator
                .addValidator('futuredatecomponent', function (value, requirement) {

                    var a = parseCSV(requirement),
                        yearSelector = a.shift(),
                        year = yearSelector === undefined ? null : String($(yearSelector).val()),
                        yearFormat = a.shift() || 'YYYY',
                        monthSelector = a.shift(),
                        month = monthSelector === undefined ? '01' : String($(monthSelector).val()),
                        monthFormat = a.shift() || 'MM',
                        daySelector = a.shift(),
                        day = daySelector === undefined ? '01' : String($(daySelector).val()),
                        dayFormat = a.shift() || 'DD';

                    // we at least need a year
                    if (yearSelector === undefined) return false;

                    // we can't use weird dates
                    if (parseInt(month) > 12) return false;

                    // weird days - need to lookup against month
                    if (parseInt(day) > 31) return false;

                    // make date
                    var date = moment(
                        year + month + day,
                        yearFormat + monthFormat + dayFormat
                    );

                    // compare to now
                    return date.isAfter(moment());

                }, 32)
                .addMessage('en', 'futuredatecomponent', 'This date is in the past.');

            // Required If
            // attr val should follow this syntax {selector},{comparison operator},{value to compare}
            window.ParsleyValidator
                .addValidator('requiredif', function (value, requirement) {

                    if (!testCondition(requirement)) return true;
                    if (typeof value == 'array' || typeof value == 'object') return value.length > 0;
                    return value ? true : false;

                }, 512)
                .addMessage('en', 'requiredif', 'This value is required.');

            // login validator
            window.ParsleyValidator
                .addValidator('login', function (value, requirement) {

                    var matchesMsisdn = /^[0-9\+ ]+$/.test(value),
                        lenMinMsisdn = value.length >= 9,
                        lenMaxMsisdn = value.length <= 18,
                        matchesEmail = /^((?!(\.{2}|^\.|\.$|^ | $))[A-Za-z0-9\._-]){1,64}@((?!(\.{2}|^\.|\.$|^ | $))[A-Za-z0-9\._-]){1,250}\.((?!( $))[A-Za-z0-9\_-]){1,250}$/.test(value),
                        lengthEmail = value.length <= 254;

                    if (matchesMsisdn && lenMinMsisdn && lenMaxMsisdn) return true;
                    if (matchesEmail && lengthEmail) return true;
                    return false;

                }, 32)
                .addMessage('en', 'login', 'Please enter a valid email or mobile number.');

            // min if
            window.ParsleyValidator
                .addValidator('minif', function (value, requirement) {

                    var a = parseCSV(requirement),
                        cmp = a.shift();

                    if (!testCondition(a)) return true;
                    return cmp <= value;

                }, 32)
                .addMessage('en', 'minif', 'This value is too small.');

            // bank account
            window.ParsleyValidator
                .addValidator('bankaccount', function (value, requirement) {

                    // this validator assumes (incorrectly) that you have:
                    // - 2 digit bank code
                    // - 4 digit branch code
                    // - 7 digit account code (should be 8)
                    // - 4 digit suffix

                    var v = (value.replace(/[\s-]/g,'') + "000000000000000000").substring(0,17).split(''),
                        // bank = v[0] + v[1],
                        // branch = v[2] + v[3] + v[4] + v[5],
                        // account = v[6] + v[7] + v[8] + v[9] + v[10] + v[11] + v[12],
                        // suffix = v[13] + v[14] + v[15] + v[16],
                        sum = 0,
                        i = 0,
                        mod,
                        products = [
                            (v[2] * 6),
                            (v[3] * 3),
                            (v[4] * 7),
                            (v[5] * 9),
                            (v[7] * 10),
                            (v[8] * 5),
                            (v[9] * 8),
                            (v[10] * 4),
                            (v[11] * 2),
                            (v[12] * 1)
                        ];

                    for (i=0; i<products.length; i++) {
                        sum += products[i];
                    }

                    mod = sum % 11;

                    return mod === 0;

                }, 32)
                .addMessage('en', 'bankaccount', 'Please provide a valid bank account number');

            // cc
            window.ParsleyValidator
                .addValidator('creditcard', function (value, requirement) {
                    return validateCC(value);
                }, 32)
                .addMessage('en', 'creditcard', 'Please provide a valid credit card number');

            // cc if
            window.ParsleyValidator
                .addValidator('creditcardif', function (value, requirement) {

                    var a = parseCSV(requirement);

                    if (!testCondition(a)) return true;
                    return validateCC(value);

                }, 32)
                .addMessage('en', 'creditcardif', 'Please provide a valid credit card number');

            // cvc
            // e.g.
            // data-validate-cvc="#ccInputSelector"
            window.ParsleyValidator
                .addValidator('cvc', function (value, requirement) {

                    var a = parseCSV(requirement),
                        ccSelector = a.shift(),
                        $ccInput = $(ccSelector);

                    // cc input?
                    if (!$ccInput.length) return false;

                    // cc val
                    if (!$ccInput.val()) return false

                    // compare to now
                    return validateCVC(value, $ccInput.val());

                }, 32)
                .addMessage('en', 'cvc', 'This CVC is invalid for the provided credit card');

            // cvc
            // e.g.
            // data-validate-cvc="#ccInputSelector,input:radio[name=paymentMethod]:checked,==,'cc'"
            window.ParsleyValidator
                .addValidator('cvcif', function (value, requirement) {

                    var a = parseCSV(requirement),
                        ccSelector = a.shift(),
                        $ccInput = $(ccSelector);

                    if (!testCondition(a)) return true;

                    // cc input?
                    if (!$ccInput.length) return false;

                    // cc val
                    if (!$ccInput.val()) return false

                    // validate CVC
                    return validateCVC(value, $ccInput.val());

                }, 32)
                .addMessage('en', 'cvcif', 'This CVC is invalid for the provided credit card');

            // min if
            window.ParsleyValidator
                .addValidator('patternif', function (value, requirement) {

                    var a = parseCSV(requirement),
                        cmp = new RegExp(a.shift());

                    if (!testCondition(a)) return true;
                    return cmp.test(value);

                }, 32)
                .addMessage('en', 'patternif', 'Please provide a valid value.');

            // Equals
            window.ParsleyValidator
                .addValidator('equals', function (value, requirement) {
                    return value == requirement;
                }, 32)
                .addMessage('en', 'equals', 'This value is invalid.');

            // validates that another field equals something
            window.ParsleyValidator
                .addValidator('otherfieldequals', function (value, requirement) {

                    var a = parseCSV(requirement),
                        selector = a.shift(),
                        cmp = a.shift();

                    return $(selector).val() == cmp;

                }, 32)
                .addMessage('en', 'otherfieldequals', 'This value is invalid.');

            // validates that another field equals something conditionally
            window.ParsleyValidator
                .addValidator('otherfieldequalsif', function (value, requirement) {

                    var a = parseCSV(requirement),
                        selector = a.shift(),
                        cmp = a.shift();

                    if (!testCondition(a)) return true;
                    return $(selector).val() == cmp;

                }, 32)
                .addMessage('en', 'otherfieldequalsif', 'This value is invalid.');


            // Equals If
            // conditional version of equals
            // attr val should follow this syntax {value},{selector},{comparison operator},{value to compare}
            window.ParsleyValidator
                .addValidator('equalsif', function (value, requirement) {

                    var a = parseCSV(requirement),
                        cmp = a.shift();

                    if (!testCondition(a)) return true;
                    return cmp == value;

                }, 32)
                .addMessage('en', 'equalsif', 'This value is invalid');


            // Password strength
            window.ParsleyValidator
                .addValidator('passwordstrength', function (value) {
                    return value.length >= 6 && /[0-9]+/.test(value) && /[a-zA-Z]+/.test(value);
                }, 32)
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
                        $form.find('[data-validate-errors-container]').each(function(){

                            var $elem = $(this),
                                $container = $($elem.attr('data-validate-errors-container')),
                                $correctContainer = $('#parsley-id-' + $elem.attr(ns + '-id')),
                                $children = $container.find('.error-list').children();

                            $correctContainer.append($children.detach());
                            if ($children.length) {
                                $correctContainer.addClass('filled');
                                $container.find('.error-list').each(function(){
                                    if (!$(this).is($correctContainer)) $(this).remove();
                                });
                            }

                            $elem.parsley()
                                .unsubscribe('parsley:field:error')
                                .subscribe('parsley:field:error', function(){

                                    setTimeout(function(){
                                        $correctContainer.find('li').each(function(idx){

                                            // keep the first one and remove the rest

                                            var cls = $(this).attr('class'),
                                                $all = $correctContainer.find('[class="' + cls + '"]'),
                                                keep = $all.length ? $all[0].outerHTML : '';

                                            if ($all.length > 1) {
                                                $all.remove();
                                                $correctContainer.append(keep);
                                            }

                                        });
                                    },0);
                                })
                                .unsubscribe('parsley:field:success')
                                .subscribe('parsley:field:success', function(){
                                    $correctContainer.removeClass('filled').find('li').remove();
                                });
                        });

                        // add classes to form once it's validated
                        $form.parsley()
                            .unsubscribe('parsley:form:validated')
                            .subscribe('parsley:form:validated', function(){
                                $form.addClass('validator-validated');
                            });

                        // handle conflict with sticky nav
                        $form.parsley()
                            .unsubscribe('parsley:form:error')
                            .subscribe('parsley:form:error', function(){

                                var $el = $('input.error, select.error, textarea.error').first(),
                                    $scrollElem = $.scrollElem(true),
                                    clearHeight = typeof docNavHeight == 'function' ? docNavHeight() : docNavHeight;

                                if ($el.length) {
                                    $scrollElem.animate({ scrollTop: $el.offsetTop() - clearHeight }, 400);
                                    $el.focus();
                                }

                            });

                        // There is a known issue with parsley remote and submit buttons
                        // The submit button value should be submitted alone with the form params if the button has a name attr
                        // https://github.com/guillaumepotier/Parsley.js/issues/826
                        // this is a hack that should act as a work around until a patch is released
                        $form.on('submit', function(e) {
                            if (!$form.validate('validate')) {
                                e.preventDefault();
                            }
                            $form.find('[type="submit"]').each(function(idx){
                                var $submit = $(this);
                                $submit.after('<input type="hidden" name="' + $submit.attr('name') + '" value="' + $submit.attr('value') + '">');
                            });
                        });
                    }
                };
            });
        });
    };
}));
