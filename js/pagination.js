;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd)
        define([
            'jquery',
            './../../pagr/pagr',
            './popstate'
        ], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object')
        module.exports = factory(
            require('jquery'),
            require('./../../pagr/pagr'),
            require('./popstate')
        );

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.pagination = factory(root.jQuery);
    }

}(this, function ($, pagr, popstate, undefined) {

    'use strict';

    return function() {

        var conf = arguments[0];

        // handle old syntax
        // selector, onAfterRequest, namespace, successTestCb, modalTemplate
        if (typeof conf != 'object') {
            conf = {
                onUpdate: arguments[0],
            }
        }

        conf.sortSelector = conf.sortSelector ||  '.js-pagination-sort a';
        conf.sortSelectedClass = conf.sortSelectedClass ||  's-selected';
        conf.showMoreSelector = conf.showMoreSelector || '.js-paginated-more';
        conf.pageLinkSelector = conf.pageLinkSelector || '.js-page-link';
        conf.disabledClass = conf.disabledClass || 's-disabled';
        conf.loadingClass = conf.loadingClass || 's-loading';
        conf.appendedTotalSelector = conf.appendedTotalSelector || '.js-pagination-appended-total';
        conf.totalSelector = conf.totalSelector || '.js-pagination-total';
        conf.filterFormSelector = conf.filterFormSelector || '.js-filter-form';
        conf.useHistory = conf.useHistory === undefined ? true : conf.useHistory;

        $(function() {

            // ensure that when you click on a sort link it is selected
            // we also flush the table contents here as pagr will reload the data
            $(conf.sortSelector).on('tap, click', function(e) {
                e.preventDefault();
                $(conf.sortSelector).removeClass(conf.sortSelectedClass);
                $(this).addClass(conf.sortSelectedClass);
                $(conf.showMoreSelector).html('');
            });

            // init load more containers with pagr
            $(conf.showMoreSelector).pagr({
                selector: conf.showMoreSelector,
                ajax: true,
                behaviour: 'append',
                pager: false,
                pageLinkSelector: conf.pageLinkSelector,
                filterFormSelector: conf.filterFormSelector,
                loadingClass: conf.loadingClass,
                disabledClass: conf.disabledClass,
                requestNotifier: function(pagr, requestUrl, qs, url) {

                    var $el         = pagr.$element,
                        updateSel   = $el.attr('data-update-url-selector') || '',
                        updateAttr  = $el.attr('data-update-url-attr') || '',
                        q           = requestUrl.split('?')[1] || '';

                    // handle update url attr
                    if (updateSel && updateAttr) {

                        // vars
                        var $uEl = $(updateSel),
                            val = $uEl.attr(updateAttr),
                            oldQ = val.split('?')[1] || '',
                            oldQs = oldQ.split('&'),
                            newQs = q.split('&'),
                            qs = {},
                            newUrl, i, item;

                        // add the existing Qs to the Q stack
                        for(i=0; i < oldQs.length; i++) {
                            item = oldQs[i].split('=');
                            qs[item[0]] = item[1];
                        }

                        // update the q stack with the new Qs
                        for(i=0; i < newQs.length; i++) {
                            item = newQs[i].split('=');
                            qs[item[0]] = item[1];
                        }

                        // resolve url
                        newUrl = $.qs(qs, val);

                        // update attr
                        $uEl.attr(updateAttr, newUrl);

                        // trigger event on the elem
                        $uEl.trigger('urlchange');
                    }

                    if (conf.useHistory)
                        popstate.pushState(
                            {
                                url: requestUrl,
                                type: 'pagination',
                                doReload: true,
                            },
                            '',
                            requestUrl
                        );

                },
                onBeforePage: function(pagr, e) {

                    // make sure the checkbox is checked
                    var $elem = $('[id="'  + $(this).attr('for') + '"]');
                    if ($elem.is('[type="checkbox"]')) {
                        e.preventDefault();
                        if ($elem.is(':checked')) $elem.prop('checked', false);
                        else $elem.prop('checked', true);
                    }

                    // sort links
                    if ($(conf.sortSelector).length)
                        pagr.$element
                            .attr(
                                'data-sort-by',
                                $(conf.sortSelector + '.' + conf.sortSelectedClass).attr('data-sort')
                            );

                    // on before page
                    if (typeof conf.onBeforePage === 'function')
                        conf.onBeforePage(pagr, e);

                },
                onInit: function(pagr, e) {

                    // add a popstate handler if history is on
                    if (conf.useHistory) popstate.bindPopState();

                    // find next buttons
                    var $els = $(conf.pageLinkSelector + '[data-page="next"]');

                    // update classes and emit events
                    $els.each(function() {
                        var $this = $(this);
                        $this.trigger('noMorePages', [$this.is('.' + conf.disabledClass)]);
                    });
                },
                onAfterPage: function(pagr, e) {

                    // find next buttons
                    var $els = $(conf.pageLinkSelector + '[data-page="next"]');

                    // re-bind polyfill
                    if (typeof picturefill == 'function')
                        picturefill();

                    // update classes and emit events
                    $els.each(function() {
                        var $this = $(this);
                        $this.trigger('noMorePages', [$this.is('.' + conf.disabledClass)]);
                    });

                    // update pagination stuff
                    $(conf.appendedTotalSelector).html(pagr.appendedTotal());
                    $(conf.totalSelector).html(pagr.getTotal());

                    if (typeof conf.onUpdate === 'function')
                        conf.onUpdate(pagr, e);
                }
            });
        });
    };
}));
