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

    return function(opts) {

        // defaults
        opts = opts || {};
        opts.hiddenClass = opts.hiddenClass || 's-hidden';
        opts.extraCloseSelector = opts.extraCloseSelector || '';
        opts.preventCloseSelector = opts.preventCloseSelector || '.m-modal__dialog';

        var closeModal = function(e) {

                e.preventDefault();

                var $target = $($('body').attr('data-activeModal'));

                // get the modal history
                var rawModalHistory = $('body').attr('data-modalHistory') || null,
                    modalHistory = rawModalHistory ? JSON.parse(rawModalHistory) : [];

                // hide the modal and trigger the close event
                $target.addClass(opts.hiddenClass).trigger('m-modal:close');

                // check the history to see if we need to restore a previous modal
                if (modalHistory.length) {

                    // get the prev modal
                    var prevModal = modalHistory.pop(),
                        $prevModal = $(prevModal);

                    // stash the modified history for later
                    $('body').attr('data-modalHistory', JSON.stringify(modalHistory));

                    // show the previous modal
                    $('body').addClass('s-modal-visible').attr('data-activeModal', prevModal);
                    $prevModal.removeClass(opts.hiddenClass).css('max-height', '100%').trigger('modal:open');
                }

                // nothing to restore close everything
                else {
                    $('body').removeClass('s-modal-visible').attr('data-activeModal', '');
                }
            },
            openModal = function(e, el) {
                e.preventDefault();

                // look for target
                var target = $(el).attr('data-modal') || $(el).attr('href'),
                    $target = $(target);

                // ensure there's a modal overlay
                if (!$('.m-modal-overlay').length && !$('.body-overlay').length && !$('.m-body-overlay').length) {
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
                        $activeModal.addClass(opts.hiddenClass);
                    }

                    $('body').addClass('s-modal-visible').attr('data-activeModal', target);
                    $target.removeClass(opts.hiddenClass).css('max-height', '100%').trigger('m-modal:open');;
                }
            };

        $(function() {

            $('.m-modal-link, .m-modal-trigger, .modal-link, .js-modal-link')
                .off('click.m-modal')
                .off('tap.m-modal')
                .on('click.m-modal tap.m-modal', function(e) {
                    openModal(e, this);
                });

            $(
                '.m-modal-overlay, ' +
                '.m-body-overlay, ' +
                '.body-overlay, ' +
                '.m-modal__close-trigger, ' +
                '.m-modal__close__trigger, ' +
                '.m-modal__close__trigger-one, ' +
                '.modal-close, ' +
                '.js-modal-close ' +
                opts.extraCloseSelector
            )
                .off('click.m-modal')
                .off('tap.m-modal')
                .on('click.m-modal tap.m-modal', function(e) {
                    var preventModalPropagation = !$(e.target).closest('.js-prevent-modal-propagation').length;
                    if(preventModalPropagation){
                        closeModal(e);
                    }
                });

            $(opts.preventCloseSelector)
                .off('click.m-modal-stop')
                .off('tap.m-modal-stop')
                .on('click.m-modal-stop tap.m-modal-stop', function(e) {
                    var preventModalPropagation = !$(e.target).closest('.js-prevent-modal-propagation').length;
                    if(preventModalPropagation){
                        e.stopPropagation();
                    }
                });

            $(document)
                .off('keyup.m-modal')
                .on('keyup.m-modal', function(e) {
                    if (e.keyCode == 27) { // escape key maps to keycode `27`
                       closeModal(e);
                    }
                });

        });
    };

}));
