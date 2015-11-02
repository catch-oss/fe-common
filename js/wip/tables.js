;(function($, undefined) {

    "use strict";

    $(function(){

        twoDegrees.tables = function(options) {

            var responsiveSelector = '.responsive',
                sortableSelector   = '.sortable',
                responsiveStyle    = 'split';

            if (options != undefined && options.responsiveSelector != undefined)
                responsiveSelector = options.responsiveSelector;

            if (options != undefined && options.sortableSelector != undefined)
                sortableSelector = options.sortableSelector;

            if (options != undefined && options.responsiveStyle != undefined)
                responsiveStyle = options.responsiveStyle;

            $('table').each(function() {

                // vars
                var $table = $(this),
                    baseUrl = $table.attr('data-base-url'),
                    conf = {
                        // classSwitchOnly: true,
                        respondStyle: responsiveStyle
                    };

                // responsive
                // ----------

                conf['respond'] = $table.is(responsiveSelector);
                $table.addClass('responsive');

                // sortable
                // --------

                if ($table.is(sortableSelector)) {

                    // yes it is
                    conf['sort'] = true;
                    $table.addClass('sortable');

                    // if there's a data url use it for sorts
                    if (baseUrl) {

                        conf['sortHandler'] = function(obj) {

                            // such vars
                            var $el                 = obj.el,
                                $trs                = obj.rows,
                                col                 = obj.col,
                                isSorted            = obj.isSorted,
                                sortTo              = obj.sortDirection,
                                _this               = obj.tablizr,
                                header              = _this.extractVal($el.find('tr').first(), col),
                                $tbody              = $el.find('tbody'),
                                id                  = $el.attr('id'),
                                dataID              = $el.attr('data-id'),
                                updateSel           = $tbody.attr('data-update-url-selector') || '',
                                updateAttr          = $tbody.attr('data-update-url-attr') || '',
                                varPage             = $tbody.attr('data-var-page') || 'page',
                                varPageSize         = $tbody.attr('data-var-page-size') || 'page_size',
                                varSortBy           = $tbody.attr('data-var-sort-by') || 'sort',
                                varSortDirection    = $tbody.attr('data-var-sort-direction') || 'direction',
                                page                = parseInt($tbody.attr('data-page')),
                                pageSize            = parseInt($tbody.attr('data-page-size')),
                                $filterForm         = $($tbody.attr('data-filter-form')),
                                formData            = $filterForm.length ? '&' + $filterForm.serialize() : '',
                                url                 = baseUrl + (baseUrl.indexOf('?') == -1 ? '?' : '&') +
                                                        varSortDirection + "=" + sortTo +
                                                        "&" + varSortBy + "=" + header +
                                                        "&" + varPage + "=1" +
                                                        "&" + varPageSize + "=" + pageSize +
                                                        formData,
                                q                   = url.split('?')[1];

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

                            // let everyone know there's something happening
                            $('html').addClass('loading');

                            // attach the meta data to the tbody for pagr
                            $tbody.attr('data-page', 1);
                            $tbody.attr('data-sort-by', header);
                            $tbody.attr('data-sort-direction', sortTo);

                            // make the ajax request
                            $.get(url, function(data) {

                                // find the table in the response
                                var $newTable = $(data).find('table');
                                if ($newTable.length > 1) {
                                    $newTable = $(data).find('table#' + id);
                                    if (!$newTable.length) $(data).find('table[data-id="' + dataID + '"]');
                                }

                                // replace the contents of the table
                                var $trsNew = $newTable.find('tbody tr');
                                $el.find('tbody').html('').append($trsNew);

                                // remove the disabled state from all the buttons
                                $('[data-page], .page-link')
                                    .removeClass('disabled')
                                    .removeClass('btn--disabled');

                                // do a sort if we need to
                                if (parseInt($el.attr('data-use-js-sort')) == 1) {

                                    $trsNew.sort(function(a,b) {

                                        var an = _this.extractVal($(a), col),
                                            bn = _this.extractVal($(b), col),
                                            cmp = an.toLowerCase().localeCompare(bn.toLowerCase());

                                        return (!isSorted || sortTo == 'asc') ? cmp : cmp * -1;

                                    });
                                }

                                // // do a limit if we need to
                                // if (parseInt($el.attr('data-use-js-limit')) == 1) {
                                //     $trsNew.each(function(idx) {
                                //         if (idx+1 > limit) $(this).hide();
                                //     });
                                // }

                                // apply the sort
                                _this.applySort($trsNew, col, sortTo);

                                // let everyone know we are done
                                $('html').removeClass('loading');

                            });
                        }
                    }
                } else {
                    conf['sort'] = false;
                }

                // init the plugin
                $table.tablizr(conf);

                // Paginated?
                // ----------

                if ($table.is('.paginated')) {

                }

            });
        }
    });

})(jQuery);
