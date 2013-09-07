module.exports = Relation;

var util = require('util');

var Entity = require('./entity');

function Relation() {
	Entity.call(this);
}

util.inherits(Relation, Entity);

Relation.prototype.getId = function () {
	return 'r' + this.id;
};