define([], function() {

    'use strict'

    if (document.getElementsByTagName('body')[0].getAttribute('data-env') == 'production') {
        if (delete(window.__REACT_DEVTOOLS_GLOBAL_HOOK__))
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {};
    }
});
