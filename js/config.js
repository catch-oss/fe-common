;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define([], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory();

    // Browser globals (root is window)
    else {
        root.catch = (root.catch || {});
        root.catch.config = factory(root.jQuery);
    }

}(this, function () {

    'use strict';

    return {
        conf: {},
        env: 'development',
        setConf: function(conf) {
            this.conf = conf;
            return this;
        },
        setEnv: function(env) {
            this.env = env;
            return this;
        },
        get: function(key) {

            var nodes = key.split('.'),
                cur = this.conf[this.env];

            if (typeof cur !== 'undefined') {
                for (var i = 0; i < nodes.length; i++) {
                    cur = cur[nodes[i]];
                }
            }

            return cur;
        }
    };
}));
