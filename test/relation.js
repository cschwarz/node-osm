var Relation = require('../lib/entities/relation');
var Member = require('../lib/entities/member');

var assert = require('assert');

describe('Relation', function () {
	describe('getMembersByRole()', function () {
		it('relation with members', function () {
			var relation = new Relation();
            relation.members.push(new Member('type1', 1, 'role1'));
            relation.members.push(new Member('type2', 2, 'role2'));

            assert.equal(relation.getMembersByRole('role1').length, 1);
            assert.equal(relation.getMembersByRole('role3').length, 0);
		});
        it('relation without members', function () {
			var relation = new Relation();

			assert.equal(relation.getMembersByRole('role').length, 0);
		});
	});
});