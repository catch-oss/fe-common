 ;(function (root, factory) {

     // AMD. Register as an anonymous module depending on jQuery.
     if (typeof define === 'function' && define.amd)
        define(
            [
                'jquery',
                './../../moment/moment',
                './util'
            ],
            factory
        );

     // Node, CommonJS-like
     else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery'),
            require('./../../moment/moment'),
            require('./util')
        );

     // Browser globals (root is window)
     else {
         root.catch = (root.catch || {});
         root.catch.validators = factory(
             root.jQuery,
             root.moment,
             root.catch.util
         );
     }

}(this, function ($, moment, util, undefined) {

    // Validation Helpers
    // ------------------

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

    var testCondition = util.testCondition,
        parseCSV = util.parseCSV;

    return {

        // some meta data on the validators
        meta: {
            required: {
                validateIfEmpty: true
            },
            requiredif: {
                validateIfEmpty: true
            }
        },

        // helpers we want to be accessible in the returned module
        helpers: {
            validateCC: function(value, blacklist, whitelist) {

                // defaults
                blacklist = blacklist || [];
                whitelist = whitelist || [];

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

                // handle black list
                if (isDinersCB && blacklist.indexOf('dinersCB') >= 0) return false;
                if (isDinersInt && blacklist.indexOf('dinersInt') >= 0) return false;
                if (isLaser && blacklist.indexOf('laser') >= 0) return false;
                if (isMaestro && blacklist.indexOf('maestro') >= 0) return false;
                if (isAE && blacklist.indexOf('AE') >= 0) return false;
                if (isVisa && blacklist.indexOf('visa') >= 0) return false;
                if (isMC && blacklist.indexOf('MC') >= 0) return false;

                // handle whitelist
                if (whitelist.length) {

                    // reject card types that are not in the whitelist
                    if (isDinersCB && whitelist.indexOf('dinersCB') < 0) return false;
                    if (isDinersInt && whitelist.indexOf('dinersInt') < 0) return false;
                    if (isLaser && whitelist.indexOf('laser') < 0) return false;
                    if (isMaestro && whitelist.indexOf('maestro') < 0) return false;
                    if (isAE && whitelist.indexOf('AE') < 0) return false;
                    if (isVisa && whitelist.indexOf('visa') < 0) return false;
                    if (isMC && whitelist.indexOf('MC') < 0) return false;

                    // reject unknown card types
                    if (
                        !isDinersCB &&
                        !isDinersInt &&
                        !isLaser &&
                        !isMaestro &&
                        !isAE &&
                        !isVisa &&
                        !isMC
                    ) return false;
                }

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
            },

            // valid CVC code
            validateCVC: function(value, ccNum) {

                var firstTwo    = first + String(ccNum.charAt(0) + ccNum.charAt(1)),
                    isAE        = ['34','37'].indexOf(firstTwo) > -1;

                // validate length
                return isAE ? /^\d{4}$/.test(value) : /^\d{3}$/.test(value);
            }
        },

        // required
        required: function(value) {
            return !!value;
        },

        // date component validator
        // e.g.
        // data-validate-futuredatecomponent="#year,YY,#month,MM,#day,DD"
        futuredatecomponent: function(value, requirement) {

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

        },

        // pastdate
        // e.g.
        // data-validate-pastdate="YYYY-MM-DD"
        pastdate: function(value, requirement) {

            // make date
            var date = moment(
                value,
                requirement || 'YYYY-MM-DD'
            );

            // compare to now
            return date.isBefore(moment());

        },

        // pastdate
        // e.g.
        // data-validate-validdate="YYYY-MM-DD"
        validdate: function(value, requirement) {

            // make date
            var date = moment(
                value,
                requirement || 'YYYY-MM-DD',
                true
            );

            // compare to now
            return date.isValid();

        },

        // futuredate
        // e.g.
        // data-validate-futuredate="YYYY-MM-DD"
        futuredate: function(value, requirement) {

            // make date
            var date = moment(
                value,
                requirement || 'YYYY-MM-DD'
            );

            // compare to now
            return date.isAfter(moment());
        },

        // Required If
        // attr val should follow this syntax {selector},{comparison operator},{value to compare}
        requiredif: function(value, requirement) {

            if (!testCondition(requirement)) return true;
            if (typeof value == 'array' || typeof value == 'object') return value.length > 0;
            return value ? true : false;
        },

        // min if
        minif: function(value, requirement) {

            var a = parseCSV(requirement),
                cmp = a.shift();

            if (!testCondition(a)) return true;
            return cmp <= value;

        },

        // max if
        maxif: function(value, requirement) {

            var a = parseCSV(requirement),
                cmp = a.shift();

            if (!testCondition(a)) return true;
            return cmp >= value;

        },

        // bank account
        bankaccount: function(value, requirement) {

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

        },

        // cc
        creditcard: function (value, requirement) {
            return this.helpers.validateCC(value);
        },

        // cc if
        creditcardif: function(value, requirement) {

            var a = parseCSV(requirement);

            if (!testCondition(a)) return true;
            return this.helpers.validateCC(value);
        },

        // cvc
        // e.g.
        // data-validate-cvc="#ccInputSelector"
        cvc: function(value, requirement) {

            var a = parseCSV(requirement),
                ccSelector = a.shift(),
                $ccInput = $(ccSelector);

            // cc input?
            if (!$ccInput.length) return false;

            // cc val
            if (!$ccInput.val()) return false

            // compare to now
            return this.helpers.validateCVC(value, $ccInput.val());
        },

        // cvc
        // e.g.
        // data-validate-cvc="#ccInputSelector,input:radio[name=paymentMethod]:checked,==,'cc'"
        cvcif: function(value, requirement) {

            var a = parseCSV(requirement),
                ccSelector = a.shift(),
                $ccInput = $(ccSelector);

            if (!testCondition(a)) return true;

            // cc input?
            if (!$ccInput.length) return false;

            // cc val
            if (!$ccInput.val()) return false

            // validate CVC
            return this.helpers.validateCVC(value, $ccInput.val());
        },

        // pattern regex
        pattern: function(value, requirement) {
            var cmp = new RegExp(a.shift());
            return cmp.test(value);
        },

        // min if
        patternif: function(value, requirement) {

            var a = parseCSV(requirement),
                cmp = new RegExp(a.shift());

            if (!testCondition(a)) return true;
            return cmp.test(value);

        },

        // Equals
        equals: function(value, requirement) {
            return value == requirement;
        },

        // Not Equals
        notequals: function(value, requirement) {
            return value != requirement;
        },

        // validates that another field equals something
        otherfieldequals: function(value, requirement) {

            var a = parseCSV(requirement),
                selector = a.shift(),
                cmp = a.shift();

            return $(selector).val() == cmp;
        },

        // validates that another field does not equal something
        otherfieldnotequals: function(value, requirement) {

            var a = parseCSV(requirement),
                selector = a.shift(),
                cmp = a.shift();

            return $(selector).val() != cmp;
        },

        // validates that another field equals something conditionally
        otherfieldequalsif: function(value, requirement) {

            var a = parseCSV(requirement),
                selector = a.shift(),
                cmp = a.shift();

            if (!testCondition(a)) return true;
            return $(selector).val() == cmp;

        },

        // Equals If
        // conditional version of equals
        // attr val should follow this syntax {value},{selector},{comparison operator},{value to compare}
        equalsif: function (value, requirement) {

            var a = parseCSV(requirement),
                cmp = a.shift();

            if (!testCondition(a)) return true;
            return cmp == value;

        },

        // Password strength
        passwordstrength: function (value) {
            return value.length >= 6 && /[0-9]+/.test(value) && /[a-zA-Z]+/.test(value);
        }
    };
}));
