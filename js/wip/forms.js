;(function($) {

    "use strict";

    $(function(){

        var uid = function($elem, idBase) {

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

        twoDegrees.forms = function() {

            $('input[type="file"]').each(function(idx) {

                var $elem = $(this),
                    id = uid($elem);

                if (!$elem.is('.filizr')) {
                    $elem
                        .on('change',function(e){

                            if($('.ie').length){
                                var filename = $(this).val().match(/[^\/\\]+$/);
                                $('.ie-filename').remove();
                                $('#BillUpload').after('<p class="ie-filename">'+filename+'</p>');
                            }

                            var file = e.target.files[0],
                                reader = new FileReader;

                            reader.onload = function(e) {

                                var $target = $('#' + id + '-wrap'),
                                    data = e.target.result,
                                    html = (/data:image/.test(data) ? '<img src="' + data + '">' : '') +
                                           '<div>' + file.name + '</div>';

                                $target.html(html);
                            };

                            reader.readAsDataURL(file);
                        })
                        .hide()
                        .addClass('filizr')
                        .after('<label class="join-upload" for="' + id + '">Upload file<div class="plus-sign"></div></label><div id="' + id + '-wrap" class=""></div>');
                }
            });
        }
    });

})(jQuery);
