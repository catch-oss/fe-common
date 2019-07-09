;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define(
            [
                'jquery',
                'body-scroll-lock'
            ],
            factory
        );

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery'),
            require('body-scroll-lock')
        );

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.modals = factory(
            root.jQuery,
            root.bodyScrollLock
        );
    }

}(this, function ($, bodyScrollLock, undefined) {

    var disableBodyScroll = bodyScrollLock.disableBodyScroll;
    var enableBodyScroll = bodyScrollLock.enableBodyScroll;

    var obj = {
        opts: {
            hiddenClass: 's-hidden',
            closeSelector: 'js-close-modal',
            preventCloseSelector: '.c-modal__body',
            overlayClass: 'c-modal-overlay',
            visibleClass: 's-modal-visible',
            modalTrigger: 'js-modal-trigger'
        },
        setOpts: function(opts) {
            for (i in opts) {
                obj.opts[i] = opts[i];
            }
            return obj;
        },
        getOpts: function() {
            return obj.opts;
        },
        closeModal: function(e) {

            if (e !== undefined) e.preventDefault();
            
            var $target = $($('body').attr('data-activeModal')),
                opts = obj.getOpts();

            // get the modal history
            var rawModalHistory = $('body').attr('data-modalHistory') || null,
                modalHistory = rawModalHistory ? JSON.parse(rawModalHistory) : [];

            // hide the modal and trigger the close event
            $target.addClass(opts.hiddenClass).trigger('modal:close');

            //enable body scroll
            enableBodyScroll($target[0]);

            // check the history to see if we need to restore a previous modal
            if (modalHistory.length) {

                // get the prev modal
                var prevModal = modalHistory.pop(),
                    $prevModal = $(prevModal);

                // stash the modified history for later
                $('body').attr('data-modalHistory', JSON.stringify(modalHistory));

                // show the previous modal
                $('body').addClass(opts.visibleClass).attr('data-activeModal', prevModal);
                $prevModal.removeClass(opts.hiddenClass).css('max-height', '100%').trigger('modal:open');

                // disable body scroll
                disableBodyScroll($prevModal[0]);
            }

            // nothing to restore close everything
            else {
                $('body').removeClass(opts.visibleClass).attr('data-activeModal', '');
            }

            return obj;
        },
        openModal: function(e, el) {

            // triggered by an event
            if (e.preventDefault !== undefined) {
                e.preventDefault();
                var target = $(el).attr('data-modal') || $(el).attr('href');
            }

            // manual trigger
            else {
                var target = e;
            }

            // look for target
            var $target = $(target),
                opts = obj.getOpts();

            // ensure there's a modal overlay
            if (!$('.' + opts.overlayClass).length) {
                $('body').append('<div class="' + opts.overlayClass + '"></div>');
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

                // show modal
                $('body').addClass(opts.visibleClass).attr('data-activeModal', '#' + $(target).attr('id'));
                $target.removeClass(opts.hiddenClass).css('max-height', '100%').trigger('modal:open');
                
                // disable body scroll
                disableBodyScroll($target[0]);
            }

            return obj;
        },
        bind: function() {

            var opts = obj.getOpts();
                
            $(function() {

                $(opts.modalTrigger)
                    .off('click.modal')
                    .off('tap.modal')
                    .on('click.modal tap.modal', function(e) {
                        obj.openModal(e, this);
                    });

                $('.' + opts.overlayClass + ', ' + opts.closeSelector)
                    .off('click.modal')
                    .off('tap.modal')
                    .on('click.modal tap.modal', function(e) {
                        var preventModalPropagation = !$(e.target).closest('.js-prevent-modal-propagation').length;
                        if (preventModalPropagation) obj.closeModal(e);
                    });

                $(opts.preventCloseSelector)
                    .off('click.modal-stop')
                    .off('tap.modal-stop')
                    .on('click.modal-stop tap.modal-stop', function(e) {
                        var preventModalPropagation = !$(e.target).closest('.js-prevent-modal-propagation').length;
                        if (preventModalPropagation) e.stopPropagation();
                    });

                $(document)
                    .off('keyup.modal')
                    .on('keyup.modal', function(e) {
                        // escape key maps to keycode `27`
                        if (e.keyCode == 27) obj.closeModal(e);
                    });
            });

            return obj;
        }
    };

    return obj;

}));
