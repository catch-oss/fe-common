;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) {
        define([
            'jquery',
            './sniff-ua',
            '../../jquery-tokenize/jquery.tokenize'
        ], factory);

    // Node, CommonJS-like
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('jquery'),
            require('./sniff-ua'),
            require('../../jquery-tokenize/jquery.tokenize')
        );

    // Browser globals (root is window)
    } else {
        root.catch = (root.catch || {});
        root.catch.multiSelect = factory(
            root.jQuery,
            root.catch.sniffUA
        );
    }

}(this, function ($, sniffUA) {

   'use strict';

   return function(selector, config, undefined) {

        sniffUA();

        var attach = function() {

           $(function() {

                // datas 	select 	Type of data source. "select" value retrive the token form a predefinded select element or JSON URL for AJAX request
                // searchParam 	search 	Name of the search parameter, for AJAX only
                // searchMaxLength 	30 	Max length of the search input
                // searchMinLength 	0 	Min length of the search input
                // newElements 	true 	If true, allow to new add token, not in select or in AJAX response
                // nbDropdownElements 	10 	Number of element in the dropdown
                // maxElements 	0 	Number max of tokens
                // delimiter 	, 	Delimiter to validate custom elements
                // autosize 	false 	Enable height autosize
                // dataType 	json 	Ajax data type
                // displayDropdownOnFocus 	false 	If true, display the dropdown on focus
                // placeholder 	false 	Placeholder string
                // debounce 	0 	Waiting time before Ajax execute queries
                // sortable 	false 	If true, the user can sort tokens (require jQuery UI)
                // onAddToken 	function(value, text, e){} 	After a token is added, if new element, value will be equal to text
                // onRemoveToken 	function(value, e){} 	After token is removed
                // onClear 	function(e){} 	After tokenize is cleared
                // onReorder 	function(e){} 	After tokens are reordering
                // onDropdownAddItem 	function(value, text, html, e){} 	After an item is added to dropdown
                // onAjaxError 	function(e){} 	When AJAX return an error
                // valueField 	value 	Name of the value field for Ajax response
                // textField 	text 	Name of the text field for Ajax response
                // htmlField 	html 	Name of the html field for Ajax response
                var tokenizeDefaults = {
                    displayDropdownOnFocus: true,
                    nbDropdownElements: 99999999999,
                    onAddToken: function(val, text, e) {

                        var $sel = $(e.select),
                            $cont = $(e.tokensContainer);

                        $cont.find('.multi-select-input-label')
                            .text($sel.attr('data-filled-label'));

                        $sel.trigger('change');
                        var $input = $sel.next().find('.TokenSearch input');
                        $input.blur();
                        $('.multi-select').removeClass('s-active');
                    },
                    onDropdownAddItem: function(value, text, html, _this) {
                        var $option = $(_this.dropdown).find('li[data-value="' + value + '"]');
                        var eventList = $._data($option[0], 'events');
                        eventList.click.unshift(eventList.click.pop());

                        // if you do a search...
                        // chrome seems to run the doc onclick handler and the search input blur over the option onclick method
                        // so....
                        // trigger the click function on mouse down as chrome is weird
                        if ($('html').is('.chrome')) {
                            $option.on('mousedown', function(e) {
                                e.stopImmediatePropagation();
                                $option.trigger('click');
                                $(document).trigger('click');
                            });
                        }
                    },
                    onRemoveToken: function(val, e) {

                        var $sel = $(e.select),
                            $cont = $(e.tokensContainer);

                        if ($cont.find('.Token').length < 1)
                            $cont.find('.multi-select-input-label')
                                .text($sel.attr('data-empty-label'));

                        $sel.trigger('change');
                   }
                },
                sel = selector || '.multi-select',
                conf = config || {},
                tokenizeConf = $.extend(
                    {},
                    tokenizeDefaults,
                    conf
                );

               // unbind the tokenizer document - this is really bad and it's expected this will breaks something else
               $(document).off('click');

               // unbind the custom handlers:
               $(document).off('click.multi');

                // intercept the touchstart event introduced by jq mobile...
                // re order to run our handler first
                $(document).on('touchstart.multi', function(e) {
                    if ($(e.target).is('.multi-select-input-label, .multi-select *')) {
                        e.stopImmediatePropagation();
                    }
                });
                var eventList = $._data(document, 'events');
                eventList.touchstart.unshift(eventList.touchstart.pop());

                // mobile mask
                $(sel).each(function(i) {

                    // set the value of $this
                    var $this = $(this),
                        // clone the conf into a local context
                        localConf = $.extend({}, tokenizeConf);

                    if ($this.attr('data-base-url') !== undefined) {
                        localConf.datas = $this.attr('data-base-url');
                    }

                    // scope the locals
                    var inst = $(this).tokenize(localConf),
                        $sel = $(inst.select),
                        $input = $(inst.searchInput),
                        $cont = $(inst.tokensContainer),
                        closing = false,
                        id = $(this).attr('id'),
                        closeHandler = function() {
                            if (closing) {
                                $cont.removeClass('Focused');
                                inst.dropdownHide();
                                closing = false;
                            } else {
                                // we intend to close
                                closing = true;
                            }
                        };

                    // modify the click handler on the container
                    $cont.off('click').on('click', function(e) {

                        // block refocus
                        if (closing) {
                            // console.log('blocking cont click handler');
                            closing = false;
                        }

                        // the original handler
                        else {
                            e.stopImmediatePropagation();
                            inst.searchInput.get(0).focus();
                            inst.updatePlaceholder();
                            if (inst.dropdown.is(':hidden') && inst.searchInput.val() != '') {
                                inst.search();
                            }
                        }
                    });

                    // modify the blur handler on the input
                    $input.off('blur').on('blur', function(e) {
                        closeHandler();
                    });

                    // modify the document handler
                    $(document).on('click.multi', function(e) {

                        // this callback runs multiple times - once for each instance
                        if (!$cont.is('.Focused')) {

                            //if the container is not focused then the event will be for another instance
                            return;
                        }

                        // manually close the thing
                        closing = true;
                        $input.trigger('blur');

                        if (inst.options.maxElements == 1) {
                            if (inst.searchInput.val()) {
                                inst.tokenAdd(inst.searchInput.val(), '');
                            }
                        }
                    });

                    // update input
                    $input.attr('id', 'multi-select-' + i);

                    // don't add more than one button
                    if (!$('#multi-select-button-' + i).length) {
                        $input.before(
                            $(
                                '<button class="multi-select-input-label" id="multi-select-button-' + i + '">' +
                                $sel.attr('data-' + ($cont.find('.Token').length < 1 ? 'empty' : 'filled') + '-label') +
                                '</button>'
                            ).on('click', function(e) {
                                triggerSelect(e);
                            })
                        );
                    }

                    // using a label
                    $("label[for='" + id + "']").off('click').on('click', function(e) {
                        triggerSelect(e);
                    });

                    // trigger the select
                    function triggerSelect(e) {

                        // prevent the default behaviour
                        e.preventDefault();

                        // prevent the event from propagating to the parent handlers
                        e.stopPropagation();

                        var $ms = $input.closest('.multi-select');

                        // trigger focus / blur appropriately
                        if ($cont.is('.Focused') || closing) {
                            $ms.trigger('multi-select:close');
                            $input.trigger('blur');
                        } else {
                            // focus doesn't seem to trigger properly so we are using click
                            $ms.trigger('multi-select:open');
                            $input.trigger('click');
                        }
                    }
               });
           });
       },
           // this is quite a nasty hack, but with the current loading arrangement there's race conditions in terms of
           // if tokenize is loaded or not - we may need to create a loader proxy
           init = function() {
               if (typeof $.fn.tokenize === 'undefined') setTimeout(init, 10);
               else attach();
           };
       init();
   };
}));
