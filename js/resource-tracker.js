;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery')
        );

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.resourceTracker = factory(
            root.jQuery
        );
    }

}(this, function ($) {
    return function (conf) {
        conf = conf || {};
        var selector = conf.selector || '.js-tracked-resource, [href$=".pdf"],[href$=".doc"],[href$=".docx"],[href$=".xlsx"],[href$=".xls"]';
        $(function () {
            $(selector)
                .each(function () {
                    var $this = $(this);
                    $this
                        .attr('target', '_blank')
                        .off('click.tracker')
                        .on('click.tracker', function () {
                            window.dataLayer.push({
                                'event': 'resource.download',
                                'fileHref': $this.attr('href'),
                                'anchorText': $this.text()
                            });
                        });
                });
        });
    };
}));