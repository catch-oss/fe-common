;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.tabs = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    return function() {

        $(function() {

            // utility functions
            var pushHistory = function($el) {

                    var url = $el.attr('data-url') || null,
                        elID = uid($el)

                    if (typeof window.history.pushState !== undefined && url)
                        history.pushState({id: elId, url: url}, '', url);
                },
                uid = function($elem, idBase) {

                    var elementID = $elem.attr('id'),
                        idBase = idBase || $elem.text().replace(/[^A-Za-z0-9]+/g, '-').toLowerCase(),
                        i = 2;

                    if (!elementID) {
                        elementID = idBase;
                        while (!elementID || $('#' + elementID).length) {
                            elementID = idBase + '-' + i;
                            i++;
                        }
                        $elem.attr('id', elementID);
                    }
                    return elementID;
                };

        	$("li[role='tab']")
                .off('click.tabs')
                .on('click.tabs', function() {

                    var $this = $(this),
                        $tabsParent = $this.closest('.tabs'),
                        tabpanid = $this.attr("aria-controls"),
                        $tabpan = $("#" + tabpanid);

                    $tabsParent.find("li[role='tab']:not(this)").attr("aria-selected", "false");
                    $this.attr("aria-selected", "true").trigger('change');

                    $tabpan.siblings("div[role='tabpanel']:not(tabpan)").attr("aria-hidden", "true");
                    $tabpan.siblings("div[role='tabpanel']:not(tabpan)").addClass("hidden");

                    $tabpan.removeClass("hidden");
                    $tabpan.attr("aria-hidden", "false");

                    pushHistory($this);
                });

            //This adds keyboard accessibility by adding the enter key to the basic click event.
            $("li[role='tab']")
                .off('keydown.tabs-enter')
                .on('keydown.tabs-enter', function(ev) {
                    if (ev.which == 13) {
                        $(this).click();
                    }
                });

            // This adds keyboard function that pressing an arrow left or arrow right from the tabs toggle the tabs.
            $("li[role='tab']")
                .off('keydown.tabs')
                .on('keydown.tabs', function(ev) {
                    if ((ev.which == 39) || (ev.which == 37)) {
                        var selected = $(this).attr("aria-selected");
                        if (selected == "true") {

                            $("li[aria-selected='false']").attr("aria-selected", "true").focus().trigger('change');
                            $(this).attr("aria-selected", "false");

                            var tabpanid = $("li[aria-selected='true']").attr("aria-controls"),
                                $tabpan = $("#" + tabpanid);

                            $("div[role='tabpanel']:not(tabpan)").attr("aria-hidden", "true");
                            $("div[role='tabpanel']:not(tabpan)").addClass("hidden");

                            $tabpan.attr("aria-hidden", "false");
                            $tabpan.removeClass("hidden");

                            pushHistory($("li[aria-selected='true']"));

                        }
                    }
                });
        });
    }

}))
