module.exports = BoundingBox;

var Coordinate = require('./coordinate');

function BoundingBox(left, bottom, right, top) {
	this.left = left;
	this.bottom = bottom;
	this.right = right;
	this.top = top;
}

BoundingBox.prototype.toBoundingBoxString = function () {
	return this.left + ',' + this.bottom + ',' + this.right + ',' + this.top;
};

BoundingBox.prototype.getCenter = function () {
	return new Coordinate((this.top + this.bottom) / 2.0, (this.right + this.left) / 2.0);
};