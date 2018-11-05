define([
    'jquery'
], function($) {

    'use strict';


    function Scroller(element){
        var _this = this;
        this.$scrollBar = $(element);
        this.lockScrollEvent = false;
        this.percent = 0;
        this.firstInitHasHappened = false;

        // Find elements and error check;
        this.$scrollBarIndicator = this.$scrollBar.find(Scroller.selectors.scrollBarIndicator);
        this.targetSelector = this.$scrollBar.attr(Scroller.selectors.scrollView);
        this.$scrollView = $(this.targetSelector);
        var innerSelector = this.$scrollBar.attr(Scroller.selectors.scrollViewInner);
        this.$scrollViewInner = this.$scrollView.find(innerSelector);

        //Bind Object to scroll view and scrollbar
        _this.$scrollView.data('scroller', this); //dont really need to do this
        _this.$scrollBar.data('scroller', this); //dont really need to do this

        _this.init = function(){
            _this.update();
            _this.firstInitHasHappened = true;
        };

        //reset state and re focus selected target to middle of scree
        _this.update = function(){
            _this.showOrHide();
            _this.unlockScroll();
            _this.indicatorSize();
            var focus = _this.getScrollViewFocus();

            _this.scrollViewPos(focus, _this.firstInitHasHappened);
            _this.scrollBarPos(focus, true);
        };

        //focus element found in from Scroller.selectors.scrollViewFocus and center in screen
        _this.getScrollViewFocus = function(){
            if(_this.firstInitHasHappened){
                return _this.percent;
            }

            var selectedElementSelector = _this.$scrollBar.attr(Scroller.selectors.scrollViewFocus);
            var $selected = _this.$scrollViewInner.find(selectedElementSelector);
            if($selected.length){
                var relX = ($selected.offset().left + $selected.width() / 2) + _this.$scrollView.scrollLeft();

                var percentageX = (relX / _this.$scrollViewInner.outerWidth() * 100);
                _this.percent = _this.fixPosition(percentageX);
                return _this.percent;
            }

        };

        //move $scrollView to a location %
        _this.scrollViewPos = function(percentage, animate){
            _this.lockScroll();
            //need to convert percentage to px value for scrollLeft
            var pos = (_this.$scrollViewInner.width() / 100 * percentage);

            if(!animate){
                _this.$scrollView.stop().animate({scrollLeft : pos}, Scroller.config.animate, _this.unlockScroll);
            } else {
                _this.$scrollView.stop().scrollLeft( pos );
                _this.unlockScroll();
            }
        };

        //resize indicator to be a a good visual representation of the current viewable region of the scrollView
        _this.indicatorSize = function(){
            var percentageW = (_this.$scrollView.width() / _this.$scrollViewInner.width() * 100);
            _this.$scrollBarIndicator.css({ width : Math.min(percentageW,100) + '%' });
            return percentageW;
        };

        //fixing the percentage values so they will display the correct values at the edges.
        _this.fixPosition = function(percentage){
            var targetx = (_this.$scrollBar.width() / 100 * percentage);
            var offset = - _this.$scrollBarIndicator.width() / 2;

            //if the target x pos is less than half the scrollBarIndicator we need to make sure we are not setting the scrollBarIndicator position from the middle but the left
            if(targetx <= _this.$scrollBarIndicator.width() / 2){
                targetx = 0;
                offset = 0;
            }

            //if the target x pos is less than half the scrollBarIndicator we need to make sure we are not setting the scrollBarIndicator position from the middle but the right
            if(targetx >= _this.$scrollBar.width() - _this.$scrollBarIndicator.width() / 2){
                targetx = _this.$scrollBar.width() - _this.$scrollBarIndicator.width() / 2;
            }

            //apply the offset
            targetx = targetx + offset;
            //return as %;
            return (targetx / _this.$scrollBar.width() * 100);
        };

        //move the scrollbar to the desired location on click or follow the scroll event of scrollview
        _this.scrollBarPos = function(p, animate){
            if(!animate){
                _this.$scrollBarIndicator.stop().animate({left : p + '%'}, Scroller.config.animate);
            } else {
                _this.$scrollBarIndicator.stop().css({left : p + '%'});
            }
        };

        _this.xEvent = function(e){
            event.stopPropagation();
            event.preventDefault();

            var posX = $(_this.$scrollBar).offset().left;
            var relX = (e.pageX - posX);
            var percentageX = (relX / _this.$scrollBar.width() * 100);

            _this.percent = _this.fixPosition(percentageX);
            _this.scrollViewPos(_this.percent);
            _this.scrollBarPos(_this.percent);
        };

        //move the scrollbar to the desired location on click or follow the scroll event of scrollview
        _this.$scrollBar.off('click.scrollbar').on('click.scrollbar', _this.xEvent);

        var random = Math.floor(Math.random() * 10);
        $(window).on('resize.scrollbar'+ this.targetSelector.replace(/[^a-z]/ig, '') + random, function() {
            _this.update();
            _this.showOrHide();
        });

        _this.timeout = null;
        _this.$scrollView.off('scroll.scrollbar')
        .on('scroll.scrollbar', function() {
            clearTimeout(_this.timeout);

            _this.timeout = setTimeout(function () {
                if (!_this.lockScrollEvent) {
                    var relX = _this.$scrollView.scrollLeft() + _this.$scrollView.width() / 2;
                    var percentageX = (relX / _this.$scrollViewInner.outerWidth() * 100);

                    _this.percent = _this.fixPosition(percentageX);
                    _this.scrollBarPos(_this.percent, true);
                }
            }, 50);
        });

        //util
        _this.showOrHide = function(){
            if(_this.$scrollViewInner.width() <=  _this.$scrollView.width()){
                _this.$scrollBar.hide();
            }else{
                _this.$scrollBar.show();
            }
        };

        //these as functions so i can add other things at the time of locking/unlocking
        _this.lockScroll = function(){
            _this.lockScrollEvent = true;
        };

        _this.unlockScroll = function(){
            _this.lockScrollEvent = false;
        };

        _this.init();

    }

    Scroller.selectors = {
        scrollView :            'data-scrollbar-scrollview',
        scrollBarIndicator :    '[data-scrollbar-indicator]',
        scrollViewInner :       'data-scrollview-inner',
        scrollViewFocus :       'data-scrollview-focus',
        visibiltyObserver :     'data-observe-parent'
    };

    Scroller.config = {
        animate : 800
    };

    return function() {
        $(function(){
            $('[' + Scroller.selectors.scrollView + ']').each(function(index, element){
                new Scroller(element);
            });

            $(window).off('toggleable.visible.custom-scroller')
            .on('toggleable.visible.custom-scroller', function(event) {

                $(event.target).find('[' + Scroller.selectors.scrollView + ']').each(function(index, element){
                    var scroller = $(element).data('scroller');
                    if(scroller instanceof Scroller){
                        scroller.init();
                    }
                });

            });
        });
    };
});
