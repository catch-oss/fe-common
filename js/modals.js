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

                    var target = $(this).attr('data-modal') || $(this).attr('href'),
                        $target = $(target);

                    if (!$('.modal-overlay').length && !$('.body-overlay').length)
                        $('body').append('<div class="modal-overlay"></div>');

                    if($target.length){
                        $('body').toggleClass('modal-visible').attr('data-activeModal',target);
                        $target.toggleClass('hidden').css('max-height',('100%'));
                    }
                });

            $('.modal-overlay, .body-overlay, .modal-close, .modal-close-one')
                .off('click.modal')
                .off('tap.modal')
                .on('click.modal tap.modal', function(e){

                    e.preventDefault();

                    var $target = $($('body').attr('data-activeModal'));

                    $('body').toggleClass('modal-visible');
                    $target.toggleClass('hidden').trigger('modal:close');
                });

        });
    };

}));
