;(function(root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.formChanged = factory(root.jQuery);
    }

} (this, function($, undefined) {

    return function() {

        $(function() {

            // .accordion-header is deprecated
            $('.m-form_change-detection, .m-form--change-detection').each(function() {

                // what are we looking at
                var $form = $(this),
                    initState = $form.data('initState') || null;

                // stash the inital form state in the elem data if needed
                if (!initState) {
                    initState = $form.serialize();
                    $form.data('initState', initState);
                }

                // bind handlers to all the elems
                $form.find('input, textarea, select').each(function() {

                    // get the current elem
                    var $el = $(this);

                    // bind handlers
                    $el .off('click.condForm')
                        .off('change.condForm')
                        .off('keyup.condForm')
                        .off('nochange.condForm')
                        .on('click.condForm, change.condForm, keyup.condForm, nochange.condForm', function() {

                            var changed = $form.data('initState') != $form.serialize();
                            $form.toggleClass('s-changed', changed);

                            var otherFormsChanged = $('form.s-changed').length > 0;
                            $('html').toggleClass('s-form-changed', changed || otherFormsChanged);
                        });
                });

                // bind undo handler
                $form.find('.m-form__undo-changes')
                    .off('click.undo')
                    .on('click.undo', function() {

                        // reset non-hidden fields
                        $form[0].reset();

                        // split up the serialized form into variable pairs
                        var formFields = decodeURIComponent($form.data('initState')).split('&');

                        // put it into an associative array
                        var splitFields = new Array();
                        for (var i in formFields){
                            vals = formFields[i].split('=');
                            splitFields[vals[0]] = vals[1];
                        }

                        // update the hidden fields
                        $form.find('input[type=hidden]').each(function() {
                            this.value = splitFields[this.name];
                        });

                        // update the selects
                        $form.find('select.droposaurusised').catchDropdown('update');

                        // trigger a change event to make e handlers fire
                        $form.find('select').trigger('change', {reset: true});

                        // trigger a dummy event on all the form elements
                        // this is mainly for conditional class handlers
                        $($form[0].elements).trigger('dummy', {reset: true});

                        // trigger a key on the non checkbox inputs
                        // mainly for labelizr
                        $form.find('input:not([type="radio"]):not([type="checkbox"])').trigger('keyup', {reset: true});

                        // changed
                        var changed = $form.data('initState') != $form.serialize();
                        $form.toggleClass('s-changed', changed);

                        // changed states
                        var otherFormsChanged = $('form.s-changed').length > 0;
                        $('html').toggleClass('s-form-changed',  changed || otherFormsChanged);
                    });
            });
        });
    }
}))
