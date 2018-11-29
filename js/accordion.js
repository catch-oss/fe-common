;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.accordions = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    /**
     * [accordion description]
     * @param  {[type]} conf [description]
     * @return {[type]}      [description]
     */
    function accordion(conf) {

        conf = conf || {};
        conf.selector = conf.selector || '.js-accordion';
        conf.activeClass = conf.activeClass || 's-active';

        $(function() {
            $(conf.selector)
                .off('click.accordion')
                .on('click.accordion', function(e) {
                    e.preventDefault();
                    $(this).toggleClass(conf.activeClass);
                });
        });
    }

    return accordion;

}))
