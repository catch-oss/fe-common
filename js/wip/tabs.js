;(function($) {

    "use strict";

    $(function(){

        twoDegrees.tabs = function() {

            function nested_connector() {
                if($('.nested-tab-finish-wrapper[aria-hidden="false"] li[aria-selected="true"]').length) {
                    $('.connector').remove();

                    // containers
                    var $tabContainer = $('.panel[aria-hidden="false"]'),
                        $finishTab = $tabContainer.find('li[aria-selected="true"]'),
                        $startTab = $('.tabs.nested.start li[aria-selected="true"]');

                    // values
                    var $nestedStartTabWidth = $startTab.width() /2,
                        $nestedFinishTabWidth = $finishTab.width() /2,
                        $nestedStartPosition = $startTab.offset(),
                        $nestedFinishPosition = $finishTab.offset();

                    // work out the length
                    var $diff = ($nestedStartTabWidth - $nestedFinishTabWidth) +
                        ($nestedStartPosition.left - $nestedFinishPosition.left);

                    var $connector = $('<div class="connector"></span>');

                    $finishTab.append($connector);

                    if ($diff < 0) {
                        $diff = Math.abs($diff);
                        $connector.css({'right': '50%','width':$diff+'px'});
                    } else {
                        $connector.css({'left': '50%','width':$diff+'px'});
                    }
                } else {
                    $('.tabs.nested.start li[aria-selected="true"]').addClass('no-pseudo');
                }
            }

        	$("li[role='tab']")
                .off('click.tabs')
                .on('click.tabs', function() {
                    var $tabsParent = $(this).closest('.tabs');
                    $tabsParent.find("li[role='tab']:not(this)").attr("aria-selected", "false");
                    //$("li[role='tab']").attr("tabindex","-1");
                    $(this).attr("aria-selected", "true").trigger('change');
                    //$(this).attr("tabindex","0");
                    var tabpanid = $(this).attr("aria-controls");
                    var tabpan = $("#" + tabpanid);

                    tabpan.siblings("div[role='tabpanel']:not(tabpan)").attr("aria-hidden", "true");
                    tabpan.siblings("div[role='tabpanel']:not(tabpan)").addClass("hidden");

                    tabpan.removeClass("hidden");
                    //tabpan.className = "panel";
                    tabpan.attr("aria-hidden", "false");

                    nested_connector();
                });

            //This adds keyboard accessibility by adding the enter key to the basic click event.
            $("li[role='tab']")
                .off('keydown.tabs-enter')
                .on('keydown.tabs-enter', function(ev) {
                    if (ev.which == 13) {
                        $(this).click();
                    }
                });

            //This adds keyboard function that pressing an arrow left or arrow right from the tabs toggel the tabs.
            $("li[role='tab']")
                .off('keydown.tabs')
                .on('keydown.tabs', function(ev) {
                    if ((ev.which == 39) || (ev.which == 37)) {
                        var selected = $(this).attr("aria-selected");
                        if (selected == "true") {
                            $("li[aria-selected='false']").attr("aria-selected", "true").focus().trigger('change');
                            $(this).attr("aria-selected", "false");

                            var tabpanid = $("li[aria-selected='true']").attr("aria-controls");
                            var tabpan = $("#" + tabpanid);
                            $("div[role='tabpanel']:not(tabpan)").attr("aria-hidden", "true");
                            $("div[role='tabpanel']:not(tabpan)").addClass("hidden");

                            tabpan.attr("aria-hidden", "false");
                            tabpan.removeClass("hidden");
                            //tabpan.className = "panel";


                        }
                    }
                });

            nested_connector();
        }
    });

})(jQuery);
