module.exports = Node;

var util = require('util');

var Coordinate = require('../coordinate');
var BoundingBox = require('../boundingbox');
var Entity = require('./entity');
var MathUtil = require('../util/mathutil');

function Node(latitude, longitude) {
	Entity.call(this);

	this.latitude = latitude;
	this.longitude = longitude;
}

util.inherits(Node, Entity);

Node.prototype.getId = function () {
	return 'n' + this.id;
};

Node.prototype.getDistance = function (latitude, longitude) {
	return MathUtil.getDistance(new Coordinate(this.latitude, this.longitude), new Coordinate(latitude, longitude));
};

Node.prototype.getCenter = function () {
	return new Coordinate(this.latitude, this.longitude);
};

Node.prototype.getBoundingBox = function () {
	return new BoundingBox(this.longitude, this.latitude, this.longitude, this.latitude);
};