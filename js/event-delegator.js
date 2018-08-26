;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'));

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.eventDelegator = factory(root.jQuery);
    }

}(this, function ($, undefined) {

    return function(conf) {

        // defaults
        conf = conf || {};
        conf.selector = conf.selector || '[data-delegate-to][data-delegate-event]';
        conf.onlyDelegateIfTargetExists = conf.onlyDelegateIfTargetExists || true;

        $(function() {

            // look at all the elems
            $(conf.selector).each(function() {

                // extract data
                $el = $(this),
                ev = $el.attr('data-delegate-event') || conf.delegateEvent,
                targetSelector = $el.attr('data-delegate-to') || conf.delegateTo,
                $delegationTarget = $(targetSelector);

                // namespace the event if it isn't already
                ev = ev.indexOf('.') >= 0 ? ev : ev + '.evDelegator';

                // bind event handlers
                $el .off(ev)
                    .on(ev, function(e) {

                        // if onlyDelegateIfTargetExists is on then don't delegate
                        // if the target doesn't exist
                        if (conf.onlyDelegateIfTargetExists && !$delegationTarget.length)
                            return;

                        // block stuff
                        e.preventDefault();

                        // delegate
                        $delegationTarget.trigger(ev);
                    });

            });
        });
    }

}))
