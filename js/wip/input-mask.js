;(function($) {

		'use strict';

		$(function(){

		twoDegrees.maskInputs = function() {
				$('.fly-buys-mask').mask('0000 0000 0000 0000');
				$('.bank-mask').mask('00 0000 0000000 009');
				$('.msisdn-mask').mask('000 000 00099');
				$('.force-prefix').on('keyup',function(){
				if($(this).data('forcePattern')){
					$(this).mask($(this).data('forcePattern'));
				}
				var forced = $(this).data('forcePrefix');
				var user_entered = $(this).val();
					if(user_entered.indexOf(forced)!=0){
						if(user_entered.length>=forced.length){
							$(this).val(forced+user_entered.slice(forced.length));
						}
						else {
							$(this).val(forced);
						}
					}
				});
			}

		});

})(jQuery);
