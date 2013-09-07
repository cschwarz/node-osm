module.exports = Entity;

function Entity(id) {
	this.id = id;
	this.tags = {};
}

Entity.prototype.getId = function () {
	return this.id;
};

Entity.prototype.getDistance = function (latitude, longitude) {
};

Entity.prototype.getCenter = function () {
};

Entity.prototype.getBoundingBox = function () {
};