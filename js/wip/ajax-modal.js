;(function($) {

    "use strict";

    $(function(){

        twoDegrees.ajaxModals = function() {

            $('.ajax-modal')
                .off('tap.ajax-modal')
                .off('click.ajax-modal')
                .on('tap.ajax-modal, click.ajax-modal', function(e) {

                    e.preventDefault();

                    var $this = $(this),
                        url = $this.attr('href'),
                        $modal = $this.closest('.ajax-modal-wrap').find('.modal').uniqueId(),
                        selector = $this.attr('data-selector');

                    if (!$('html').is('.loading')) {
                        $('html').addClass('loading');
                        $.get(url, function(data, textStatus, jqXHR) {

                            // update dom
                            $modal.find('.modal-body').html('').append($(data).find(selector));
                            $('html').removeClass('loading');

                            // trigger modal
                            var $a = $('<a class="modal-trigger" data-modal="#' +  $modal.attr('id') + '" />');
                            $this.after($a);
                            twoDegrees.modal();
                            $a.trigger('tap').remove();

                        });
                    }
                });
        }
    });

})(jQuery);
