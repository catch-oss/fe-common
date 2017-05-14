;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define(
            [
                'jquery',
                './util'
            ],
            factory
        );

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery'),
            require('./util')
        );

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.summary = factory(
            root.jQuery,
            root.catch.util
        );
    }

} (this, function ($, util) {

    return function(opts) {

        opts = opts || {};

        var selector = opts.selector || '.js-summary';

        $(selector).find('[data-src]').each(function(idx) {

            var $this = $(this),
                $src = $($this.attr('data-src')),
                mapStr = $this.attr('data-map') || '',
                map = mapStr ? JSON.parse(mapStr.replace(/'/g,'"')) : {},
                uuid = util.elemId($this);

            $src.off('keyup.summary' + uuid)
                .off('DOMAttrModified.summary' + uuid)
                .off('propertychange.summary' + uuid)
                .off('change.summary' + uuid)
                .off('blur.summary' + uuid)
                .off('faked.summary' + uuid)
                .on(
                    'keyup.summary' + uuid +
                    ' DOMAttrModified.summary' + uuid +
                    ' propertychange.summary' + uuid +
                    ' change.summary' + uuid +
                    ' blur.summary' + uuid +
                    ' faked.summary' + uuid,
                    function() {

                        var raw = $src.val(),
                            val = map[raw] || raw;

                        $this.html(val);
                    }
                )
                .trigger('faked');
        });

    };
}));
