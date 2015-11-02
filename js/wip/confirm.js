;(function($) {

    "use strict";

    $(function(){

		twoDegrees.confirm = function() {

            // var old = '<div class="modal modal--confirm">' +
            //                 '<div class="modal-backdrop"></div>' +
            //                 '<div class="modal-dialog">' +
            //                     '<div class="modal-header">' +
            //                         '<h3>{{title}}</h3>' +
            //                     '</div>' +
            //                     '<div class="modal-body">' +
            //                         '<p>{{message}}</p>' +
            //                         '<div class="actions">' +
            //                             '<a href="" class="btn btn--danger btn--small confirmadon-yes" title="">{{yes}}</a>' +
            //                             '<a href="" class="btn btn--tertiary btn--small confirmadon-no" title="">{{no}}</a>' +
            //                         '</div>' +
            //                     '</div>' +
            //                 '</div>' +
            //             '</div>';

            var template = function(danger) {
                return  '<div class="modal" id="modal-prepay-find-sim">' +
                            '<div class="modal-dialog modal--compact">' +
                                '<div class="modal-header modal-header-wrapper">' +
                                    '<div class="modal-dialog-inner">' +
                                        '<h3>{{title}}</h3>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="modal-body">' +
                                    '<div class="modal-dialog-inner modal-dialog-inner-body">' +
                                        '<p>{{message}}</p>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="modal-footer">' +
                                    '<div class="modal-dialog-inner">' +
                                        '<a href="" class="btn btn--' + (danger ? 'danger' : 'success') + ' btn--small confirmadon-yes" title="">{{yes}}</a> ' +
                                        '<a href="" class="btn btn--tertiary btn--small confirmadon-no" title="">{{no}}</a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
            };

			$('.confirm').confirmadon({
				visibleClass: 'active',
				fade: false,
				template: template(true),
				onAfterShow: function() {
					$('body').addClass("modal-active");
				},
				onAfterHide: function() {
					$('body').removeClass("modal-active");
				}
			});

            $('.confirm-positive').confirmadon({
				visibleClass: 'active',
				fade: false,
				template: template(false),
				onAfterShow: function() {
					$('body').addClass("modal-active");
				},
				onAfterHide: function() {
					$('body').removeClass("modal-active");
				}
			});
		}
    });

})(jQuery);
