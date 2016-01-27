;(function (root, factory) {

     // AMD. Register as an anonymous module depending on jQuery.
     if (typeof define === 'function' && define.amd) define(['jquery', './../../jquery-tokenize/jquery.tokenize'], factory);

     // Node, CommonJS-like
     else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../../jquery-tokenize/jquery.tokenize'));

     // Browser globals (root is window)
     else {
         root.catch = (root.catch || {});
         root.catch.multiSelect = factory(root.jQuery);
     }

}(this, function ($, undefined) {

    'use strict';

    return function(selector, conf) {

        $(function() {

            // fallbacks
            selector = selector || '.multi-select';
            conf = conf || {};

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
            var defaults = {

            }

            // mobile mask
            $(selector)
                .tokenize(
                    $.extend(
                        {},
                        defaults,
                        conf
                    )
                );

        });

    };

}));
