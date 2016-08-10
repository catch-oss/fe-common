;(function (root, factory) {

     // AMD. Register as an anonymous module depending on jQuery.
     if (typeof define === 'function' && define.amd) define(['jquery', './../../pagr/pagr', './accordions'], factory);

     // Node, CommonJS-like
     else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../../pagr/pagr'), require('./accordions'));

     // Browser globals (root is window)
     else {
         root.catch = (root.catch || {});
         root.catch.pagination = factory(root.jQuery);
     }

}(this, function ($, pagr, accordions, undefined) {

    'use strict';

    return function() {

        $(function() {

            // ensure that when you click on a sort link it is selected
            // we also flush the table contents here as pagr will reload the data
            $('.pagination-sort a').on('tap, click', function(e) {
                e.preventDefault();
                $('.pagination-sort a').removeClass('selected');
                $(this).addClass('selected');
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
                    if ($('.pagination-sort a').length)
                        pagr.$element.attr('data-sort-by', $('.pagination-sort a.selected').attr('data-sort'));

                },
                onAfterPage: function(pagr, e) {
                    if (typeof pictureFill == 'function') pictureFill();
                    accordions();
                    var nextButton = $('.page-link[data-page="next"]');
                    nextButton.toggleClass('btn--disabled', nextButton.is(".disabled"))
                        .trigger('noMorePages', [nextButton.is(".disabled")]);
                    $('.pagination-appended-total').html(pagr.appendedTotal());
                    $('.pagination-total').html(pagr.getTotal());
                }
            });
        });
    };
}));
