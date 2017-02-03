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

                $form.find('input, textarea, select').each(function() {

                    var $el = $(this);

                    $el .off('click.condForm')
                        .off('change.condForm')
                        .off('keyup.condForm')
                        .off('nochange.condForm')
                        .on('click.condForm, change.condForm, keyup.condForm, nochange.condForm', function() {
                            var changed = $form.data('initState') != $form.serialize();
                            $form.toggleClass('s-changed', changed);
                        });
                });
            });
        });
    }
}))
