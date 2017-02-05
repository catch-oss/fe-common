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
            root.catch.modals,
            root.catch.util
        );
    }

}(this, function ($, modals, util, undefined) {

    var makeSelectedRow = function($opt, $selection) {

            // extract IDs
            var optId = util.elemId($opt),
                rowId = optId + '-selection-item';

            // don't double add
            if ($selection.find('#' + rowId).length) return;

            // make elems
            var $remove = $('<a class="m-multi-select__remove">Remove</a>'),
                $row = $(
                    '<li id="' + rowId + '" class="m-multi-select__selection__item">' +
                        '<span class="m-multi-select__selection__item__title">' +
                            $opt.text() +
                        '</span>' +
                        '<span class="m-multi-select__selection__item__actions">' +
                        '</span>' +
                    '</li>'
                );

            // event handler
            $remove.on('click', function() {
                $opt.prop('selected', false);
                $row.remove();
            });

            // compile the row
            $row.find('.m-multi-select__selection__item__actions').append($remove);

            // add the elements constructed elems
            $selection.append($row);
        },
        removeSelectedRow = function($opt, $selection) {

            // ids
            var optId = util.elemId($opt),
                rowId = optId + '-selection-item';

            // remeove the item
            $selection.find('#' + rowId).remove();
        };

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
                    $select = $el.find('select'),
                    triggerClasses = $select.attr('data-trigger-classes') || 'm-btn',
                    triggerCopy = $select.attr('data-trigger-copy') || 'Add',
                    tplVars = JSON.parse($select.attr('data-tpl-vars') || '{}'),
                    selectId = util.elemId($select),
                    modalId = selectId + '-modal',
                    $trigger = $(
                        '<a data-modal="#' + modalId + '" ' +
                           'class="m-modal-link ' + triggerClasses + '">' +
                            triggerCopy +
                        '</a>'
                    ),
                    $selection = $('<div class="m-multi-select__selection" />'),
                    $content = $('<div />'),
                    $modal,
                    i;

                // update the tpl vars
                tplVars.id = modalId;
                tplVars.content = '<div class="m-multi-select__modal__content" />';

                // parse all the tpl vars
                for (i in tplVars) {
                    opts.tpl = opts.tpl.replace('{{' + i + '}}', tplVars[i]);
                }

                // generate the modal
                $modal = $(opts.tpl);

                // inject other elements
                $select
                    .hide()
                    .off('change.multselectmodal')
                    .on('change.multselectmodal', function() {
                        $select.find('option').each(function() {

                            // get the option
                            var $opt = $(this),
                                optId = util.elemId($opt),
                                checkId = optId + '-check',
                                selected = $opt.is(':selected');

                            // update checkbox
                            $('#' + checkId).prop('checked', selected);

                            // create/remove elem
                            selected
                                ? makeSelectedRow($opt, $selection)
                                : removeSelectedRow($opt, $selection);
                        });
                    })
                    .find('option')
                        .each(function() {

                            // extract data and create elems
                            var $opt = $(this),
                                text = $opt.text(),
                                optId = util.elemId($opt),
                                id = optId + '-check',
                                isSelected = $opt.is(':selected'),
                                $check = $('<input type="checkbox" id="' + id + '">').prop('checked', isSelected),
                                $label = $('<label for="' + id + '" class="m-checkbox">' + text + '</label>'),
                                $row = $('<div class="m-multi-select__modal__content__row"/>').append($check).append($label);

                            // create/remove elem
                            isSelected
                                ? makeSelectedRow($opt, $selection)
                                : removeSelectedRow($opt, $selection);

                            // add the row
                            $content.append($row);

                            // add handlers
                            $check.on('click change', function() {

                                // is it checked?
                                var checked = $check.is(':checked');

                                // set the select val
                                $opt.prop('selected', checked);

                                // create/remove elem
                                checked
                                    ? makeSelectedRow($opt, $selection)
                                    : removeSelectedRow($opt, $selection);
                            });
                        });

                // compile the modal
                $modal.find('.m-multi-select__modal__content').append($content);

                // inject the content
                $select.before($selection).after($trigger);
                $('body').append($modal);

                // activate the modal
                modals();
            })
        });
    }

}));
