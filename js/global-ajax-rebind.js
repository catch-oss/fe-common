define(['jquery'], function($) {

    'use strict';

    return function(conf) {

        if ($('.js-global-ajax-rebind').length) {

            $(document).ajaxSuccess(function(e, xhr, settings) {

                if (typeof conf.cb == 'function') {
                    conf.cb(e, xhr, settings);
                }
            });
        }
    };
});
