;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.modal = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    return function() {

        $(function() {


            $('.modal-link').off('click.modal').on('click.modal',function(e) {

                e.preventDefault();

                var target = $(this).data('modal') || $(this).attr('href'),
                    $target = $(target);

                if (!$('.modal-overlay').length)
                    $('body').append('<div class="modal-overlay"></div>');

                if($target.length){
                    $('body').toggleClass('modal-visible').data('activeModal',target);
                    $target.toggleClass('hidden').css('max-height',('100%'));
                }
            });

            $('.modal-overlay, .modal-close, .modal-close-one').off('click.modal').on('click.modal', function(e){

                e.preventDefault();

                var $target = $($('body').data('activeModal'));

                $('body').toggleClass('modal-visible');
                $target.toggleClass('hidden');
            });

        });
    };

}));
