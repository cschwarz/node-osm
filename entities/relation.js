module.exports = Relation;

var util = require('util');
var _ = require('underscore');

var Entity = require('./entity');

function Relation() {
	Entity.call(this);

	this.members = [];

	this._nodes = [];
	this._ways = [];
	this._relations = [];
}

util.inherits(Relation, Entity);

Relation.prototype.getId = function () {
	return 'r' + this.id;
};

Relation.prototype.getMembersByRole = function (role) {
    return _.filter(this.members, function (member) {
        return member.role === role;
    });
};