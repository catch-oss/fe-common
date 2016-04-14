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


            $('.modal-link, .modal-trigger')
                .off('click.modal')
                .off('tap.modal')
                .on('click.modal tap.modal',function(e) {

                    e.preventDefault();

                    // look for target
                    var target = $(this).attr('data-modal') || $(this).attr('href'),
                        $target = $(target);

                    // ensure there's a modal overlay
                    if (!$('.modal-overlay').length && !$('.body-overlay').length)
                        $('body').append('<div class="modal-overlay"></div>');

                    // does the modal exist
                    if ($target.length) {

                        // look to see if there is already an active modal
                        var activeModal = $('body').attr('data-activeModal'),
                            $activeModal = $(activeModal);

                        // if the active modal exists
                        if ($activeModal.length) {

                            // get the modal history
                            var rawModalHistory = $('body').attr('data-modalHistory') || null,
                                modalHistoy = rawModalHistory ? JSON.parse(rawModalHistory) : [];

                            // push the active modal onto the stack
                            modalHistoy.push(activeModal);

                            // stash it for later
                            $('body').attr('data-modalHistory', JSON.stringify(modalHistoy));

                            // hide it
                            $activeModal.addClass('hidden');
                        }

                        $('body').addClass('modal-visible').attr('data-activeModal', target);
                        $target.removeClass('hidden').css('max-height', '100%').trigger('modal:open');;
                    }
                });

            $('.modal-overlay, .body-overlay, .modal-close, .modal-close-one')
                .off('click.modal')
                .off('tap.modal')
                .on('click.modal tap.modal', function(e){

                    e.preventDefault();

                    var $target = $($('body').attr('data-activeModal'));

                    // get the modal history
                    var rawModalHistory = $('body').attr('data-modalHistory') || null,
                        modalHistoy = rawModalHistory ? JSON.parse(rawModalHistory) : [];

                    console.log(rawModalHistory);
                    console.log(modalHistory);

                    // hide the modal and trigger the close event
                    $target.addClass('hidden').trigger('modal:close');

                    // check the history to see if we need to restore a previous modal
                    if (modalHistory.length) {

                        // get the prev modal
                        var prevModal = modalHistory.pop(),
                            $prevModal = $(prevModal);

                        // stash the modified history for later
                        $('body').attr('data-modalHistory', JSON.stringify(modalHistoy));

                        // show the previous modal
                        $('body').addClass('modal-visible').attr('data-activeModal', prevModal);
                        $prevModal.removeClass('hidden').css('max-height', '100%').trigger('modal:open');
                    }

                    // nothing to restore close everything
                    else {
                        $('body').removeClass('modal-visible');
                    }

                });

        });
    };

}));
