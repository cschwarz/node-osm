var _ = require('underscore');

module.exports = function (o) {
    _.each(o, function (v, k) {
        if (_.isUndefined(v))
            delete o[k];
    });
    return o;
};