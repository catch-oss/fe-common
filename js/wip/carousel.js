
;(function($, undefined) {

    "use strict";

    $(function(){

        twoDegrees.carousel = function(selector) {

            selector = selector || '.cta-multi.cta-carousel .cta-wrapper';

            $(selector).each(function() {

                var $this = $(this),
                    drag = $this.is('.no-drag *') ? false : 'touch';

                $this.slidatron({
                    classNameSpace  : "twodeg",
                    adaptiveHeight  : true,
                    translateY      : true,
                    transition      : 'opacity',
                    drag            : drag,
                    autoSlide       : $this.is('.auto-slide *'),
                    cursor          : '',
                    onAfterInit     : function($elem, tron) {
                        $elem
                        .off('click.showStopper')
                        .on('click.showStopper', function() {
                            tron.stopShow();
                        })
                        .find('.video-play')
                            .off('click.showStopper')
                            .on('click.showStopper', function() {
                                tron.stopShow();
                            })
                            .end()
                        .find('.video-close')
                            .off('click.showStopper')
                            .on('click.showStopper', function() {
                                tron.startShow();
                            })

                    }
                });

            });



        };
    });
})(jQuery);
