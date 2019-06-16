;(function (root, factory) {

     // AMD. Register as an anonymous module depending on jQuery.
     if (typeof define === 'function' && define.amd)
        define(['jquery', './accordions', './../../pagr/pagr'], factory);

     // Node, CommonJS-like
     else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./accordions'), require('./../../pagr/pagr'));

     // Browser globals (root is window)
     else {
         root.catch = (root.catch || {});
         root.catch.pagination = factory(root.jQuery, root.catch.accordions);
     }

}(this, function ($, accordions, pagr, undefined) {

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
        conf.showMoreClass = conf.showMoreClass || '.js-paginated-more';

        $(function() {

            // ensure that when you click on a sort link it is selected
            // we also flush the table contents here as pagr will reload the data
            $(conf.sortSelector).on('tap, click', function(e) {
                e.preventDefault();
                $(conf.sortSelector).removeClass(conf.sortSelectedClass);
                $(this).addClass(conf.sortSelectedClass);
                $('.paginated.paginated-more').html('');
            });

            // init load more containers with pagr
            $('.paginated.paginated-more').pagr({
                ajax: true,
                behaviour: 'append',
                pager: false,
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
                        pagr.$element.attr('data-sort-by', $(conf.sortSelector + '.' + conf.sortSelectedClass).attr('data-sort'));

                },
                onInit: function(pagr, e) {

                    // find next buttons
                    var $els = $('.page-link[data-page="next"]');

                    // update classes and emit events
                    $els.each(function() {
                        var $this = $(this);
                        $this.toggleClass('btn--disabled', $this.is(".disabled"))
                             .trigger('noMorePages', [$this.is(".disabled")]);
                    });
                },
                onAfterPage: function(pagr, e) {

                    // find next buttons
                    var $els = $('.page-link[data-page="next"]');

                    // re-bind
                    if (typeof picturefill == 'function') picturefill();
                    accordions();

                    // update classes and emit events
                    $els.each(function() {
                        var $this = $(this);
                        $this.toggleClass('btn--disabled', $this.is(".disabled"))
                             .trigger('noMorePages', [$this.is(".disabled")]);
                    });

                    // update pagination stuff
                    $('.pagination-appended-total').html(pagr.appendedTotal());
                    $('.pagination-total').html(pagr.getTotal());

                    if (typeof conf.onUpdate === 'function') {
                        conf.onUpdate();
                    }
                }
            });
        });
    };
}));
