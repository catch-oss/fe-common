;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define(['jquery', './modals', './util'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery'),
            require('./modals'),
            require('./util')
        );

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.multiSelectModal = factory(
            root.jQuery,
            root.catch.modals
        );
    }

}(this, function ($, modals, util, undefined) {

    return function(options) {

        // default to an empty obj
        var opts = options || {};

        // classic + the strings together...
        var defaultTemplate =   '<div class="m-modal s-hidden" id="{{id}}">' +
                                    '<div class="m-modal__dialog m-modal__dialog--compact">' +
                                        '<div class="m-modal__close">' +
                                            '<div class="m-modal__close__inner">' +
                                                '<a class="m-modal__close__trigger h-icon--close">Close</a>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="m-modal__body">' +
                                            '<div class="m-modal__body__inner">' +
                                                '{{content}}' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>';

        // parse the options
        opts.tpl = opts.tpl || defaultTemplate;

        $(function() {

            // .accordion-header is deprecated
            $('.m-multi-select_modal, .m-multi-select--modal').each(function() {

                // get the parent
                var $el = $(this),
                    $select = $this.find('select'),
                    $content = $('<div />');

                // inject other elements
                $select.find('option').each(function() {

                    var $opt = $(this),
                        id =
                        $check = $('<input type="checkbox" id="' +  + '"')


                });
            })
        });
    }

}))
