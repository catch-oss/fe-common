;(function($) {

    "use strict";

    $(function(){

        twoDegrees.video = function() {

            var tag = document.createElement('script'),
                firstScriptTag = document.getElementsByTagName('script')[0];

            tag.setAttribute('language','JavaScript');
            tag.setAttribute('type','text/javascript');
            tag.src = "https://www.youtube.com/iframe_api";
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = function() {

                $('[data-video-id]').each(function() {
                    var player,
                        $el = $(this),
                        id = $el.attr('data-video-id'),
                        $wrap = $el.closest('.video-container'),
                        onPlayerReady = function(event) {

                            $wrap.find('.video-play').addClass('ready');

                            $wrap.find('.video-play').on('click',function(e) {
                                e.preventDefault();
                                $wrap.addClass('active');
                                if ($wrap.hasClass('video-sm')) $('.body').addClass('no-overflow');
                                var tmp = getPlayer();
                                if (tmp && typeof tmp.playVideo == 'function') tmp.playVideo();
                            });

                            $wrap.find('.video-close').on('click',function(e) {
                                e.preventDefault();
                                $wrap.removeClass('active');
                                if ($wrap.hasClass('video-sm')) $('.body').removeClass('no-overflow');
                                setTimeout(function(){
                                      var tmp = getPlayer();
                                      if (tmp && typeof tmp.stopVideo == 'function') tmp.stopVideo();
                                      player = getPlayer(true);
                                }, 500);
                            });
                        },
                        getPlayer = function(force) {

                            force = force || false;

                            if (force || !player || typeof player.playVideo != 'function') {

                                if (player && typeof player.destroy == 'function') player.destroy();

                                player = new YT.Player($el[0], {
                                    playerVars: { 'autoplay': 0, 'controls': 0 },
                                    height: '390',
                                    width: '640',
                                    videoId: id,
                                    events: {
                                        'onReady': onPlayerReady
                                    }
                                });
                            }

                            return player;
                        };

                        // // Close when click away
                        // $('html').click(function(e) {
                        //        if(($('.video-container').hasClass('active')) && (!$(e.target).hasClass('video'))) {
                        //            $('.video-container').removeClass('active');
                        //            setTimeout(function(){
                        //               var tmp = getPlayer();
                        //               if (tmp && typeof tmp.stopVideo == 'function') tmp.stopVideo();
                        //               player = getPlayer(true);
                        //         }, 500);
                        //        }
                        // });
                    player = getPlayer();
                });
            }

        }

    });

})(jQuery);
