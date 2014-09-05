module.exports = Entity;

var _ = require('underscore');

function Entity(id) {
	this.id = id;
	this.tags = {};
}

Entity.prototype.getId = function () {
	return this.id;
};

Entity.prototype.hasTag = function (key, value) {
    if (!_.has(this.tags, key))
        return false;

    if (!_.isUndefined(value))
        return this.tags[key] === value;

    return true;
};

Entity.prototype.getDistance = function (latitude, longitude) {
};

Entity.prototype.getCenter = function () {
};

Entity.prototype.getBoundingBox = function () {
};