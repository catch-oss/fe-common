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

    return function(onUpdate, namespace = '') {

        $(function() {

            // ensure that when you click on a sort link it is selected
            // we also flush the table contents here as pagr will reload the data
            $('.' + namespace + 'pagination-sort a').on('tap, click', function(e) {
                e.preventDefault();
                $('.' + namespace + 'pagination-sort a').removeClass('selected');
                $(this).addClass('selected');
                $('.' + namespace + 'paginated.' + namespace + 'paginated-more').html('');
            });

            // init load more containers with pagr
            $('.' + namespace + 'paginated.' + namespace + 'paginated-more').pagr({
                ajax: true,
                behaviour: 'append',
                pager: false,
                pageLinkSelector: '.' + namespace + 'page-link',
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
                    if ($('.' + namespace + 'pagination-sort a').length)
                        pagr.$element.attr('data-sort-by', $('.' + namespace + 'pagination-sort a.selected').attr('data-sort'));

                },
                onInit: function(pagr, e) {

                    // find next buttons
                    var $els = $('.' + namespace + 'page-link[data-page="next"]');

                    // update classes and emit events
                    $els.each(function() {
                        var $this = $(this);
                        $this.toggleClass('btn--disabled', $this.is(".disabled"))
                             .trigger('noMorePages', [$this.is(".disabled")]);
                    });
                },
                onAfterPage: function(pagr, e) {

                    // find next buttons
                    var $els = $('.' + namespace + 'page-link[data-page="next"]');

                    // re-bind
                    if (typeof picturefill == 'function') picturefill();
                    accordions();

                    // update classes and emit events
                    $els.each(function() {
                        var $this = $(this);
                        $this.toggleClass('btn--disabled', $this.is(".disabled"))
                             .trigger('noMorePages', [$this.is(".disabled")]);
                    });

                    // update ' + namespace + 'pagination stuff
                    $('.' + namespace + 'pagination-appended-total').html(pagr.appendedTotal());
                    $('.' + namespace + 'pagination-total').html(pagr.getTotal());

                    if (typeof onUpdate === 'function') {
                        onUpdate();
                    }
                }
            });
        });
    };
}));
