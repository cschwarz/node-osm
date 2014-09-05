module.exports = Way;

var util = require('util');
var _ = require('underscore');

var BoundingBox = require('../boundingbox');
var Entity = require('./entity');

function Way() {
	Entity.call(this);

	this.nodeReferences = [];

	this._nodes = [];
}

util.inherits(Way, Entity);

Way.prototype.getId = function () {
	return 'w' + this.id;
};

Way.prototype.getDistance = function (latitude, longitude) {
	if (this._nodes.length === 0)
		return;

	var nearestNode = _.min(this._nodes, function (node) {
		var deltaLatitude = latitude - node.latitude;
		var deltaLongitude = longitude - node.longitude;
		return (deltaLatitude * deltaLatitude) + (deltaLongitude * deltaLongitude);
	});

	return nearestNode.getDistance(latitude, longitude);
};

Way.prototype.getCenter = function () {
	return this.getBoundingBox().getCenter();
};

Way.prototype.getBoundingBox = function () {
	return new BoundingBox(
		_.min(this._nodes, function (n) { return n.longitude; }).longitude,
		_.min(this._nodes, function (n) { return n.latitude; }).latitude,
		_.max(this._nodes, function (n) { return n.longitude; }).longitude,
		_.max(this._nodes, function (n) { return n.latitude; }).latitude);
};