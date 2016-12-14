;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.modals = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    return function() {

        $(function() {

            $('.m-modal-link, .m-modal-trigger')
                .off('click.m-modal')
                .off('tap.m-modal')
                .on('click.m-modal tap.m-modal',function(e) {

                    e.preventDefault();

                    // look for target
                    var target = $(this).attr('data-modal') || $(this).attr('href'),
                        $target = $(target);

                    // ensure there's a modal overlay
                    if (!$('.m-modal-overlay').length && !$('.body-overlay').length) {
                        $('body').append('<div class="m-modal-overlay"></div>');
                    }

                    // does the modal exist
                    if ($target.length) {

                        // look to see if there is already an active modal
                        var activeModal = $('body').attr('data-activeModal'),
                            $activeModal = $(activeModal);

                        // if the active modal exists
                        if ($activeModal.length) {

                            // don't push the modal we are displaying into the history
                            if ($target[0] !== $activeModal[0]) {

                                // get the modal history
                                var rawModalHistory = $('body').attr('data-modalHistory') || null,
                                    modalHistory = rawModalHistory ? JSON.parse(rawModalHistory) : [];

                                // push the active modal onto the stack
                                modalHistory.push(activeModal);

                                // stash it for later
                                $('body').attr('data-modalHistory', JSON.stringify(modalHistory));
                            }

                            // hide it
                            $activeModal.addClass('is-hidden');
                        }

                        $('body').addClass('js-modal-visible').attr('data-activeModal', target);
                        $target.removeClass('is-hidden').css('max-height', '100%').trigger('m-modal:open');;
                    }
                });

            $('.m-modal-overlay, .body-overlay, .m-modal__close__trigger, .m-modal__close__trigger-one')
                .off('click.m-modal')
                .off('tap.m-modal')
                .on('click.m-modal tap.m-modal', function(e) {

                    e.preventDefault();

                    var $target = $($('body').attr('data-activeModal'));

                    // get the modal history
                    var rawModalHistory = $('body').attr('data-modalHistory') || null,
                        modalHistory = rawModalHistory ? JSON.parse(rawModalHistory) : [];

                    // hide the modal and trigger the close event
                    $target.addClass('is-hidden').trigger('m-modal:close');

                    // check the history to see if we need to restore a previous modal
                    if (modalHistory.length) {

                        // get the prev modal
                        var prevModal = modalHistory.pop(),
                            $prevModal = $(prevModal);

                        // stash the modified history for later
                        $('body').attr('data-modalHistory', JSON.stringify(modalHistory));

                        // show the previous modal
                        $('body').addClass('js-modal-visible').attr('data-activeModal', prevModal);
                        $prevModal.removeClass('is-hidden').css('max-height', '100%').trigger('modal:open');
                    }

                    // nothing to restore close everything
                    else {
                        $('body').removeClass('js-modal-visible').attr('data-activeModal', '');
                    }

                });

        });
    };

}));
