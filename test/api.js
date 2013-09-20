var Api = require('../api');

var assert = require('assert');
var util = require('util');

describe('Api', function () {
	describe('node()', function () {
		it('should return node', function (done) {
			Api.node(537791625).then(function (node) {
				assert.equal(node.id, 537791625);
			},
			function (e) {
				throw new Error(util.inspect(e));
			}).then(done, done);
		});
		it('should return 404', function (done) {
			Api.node(-1).then(function (node) {
				throw new Error();
			},
			function (e) {
				assert.equal(e.statusCode, 404);
			}).then(done, done);
		});
	});
	describe('way()', function () {
		it('should return way', function (done) {
			Api.way(23410161).then(function (way) {
				assert.equal(way.id, 23410161);
				assert.equal(way.nodeReferences.length, 6);
				assert.equal(way._nodes.length, 0);
			},
			function (e) {
				throw new Error(util.inspect(e));
			}).then(done, done);
		});
		it('should return way with nodes', function (done) {
			Api.way(23410161, true).then(function (way) {
				assert.equal(way.id, 23410161);
				assert.equal(way.nodeReferences.length, 6);
				assert.equal(way._nodes.length, 6);
			},
			function (e) {
				throw new Error(util.inspect(e));
			}).then(done, done);
		});
		it('should return 404', function (done) {
			Api.way(-1).then(function (way) {
				throw new Error();
			},
			function (e) {
				assert.equal(e.statusCode, 404);
			}).then(done, done);
		});
	});
	describe('relation()', function () {
		it('should return relation', function (done) {
			Api.relation(108723).then(function (relation) {
				assert.equal(relation.id, 108723);
				assert.equal(relation.members.length, 143);
				assert.equal(relation._nodes.length, 0);
				assert.equal(relation._ways.length, 0);
				assert.equal(relation._relations.length, 0);
			},
			function (e) {
				throw new Error(util.inspect(e));
			}).then(done, done);
		});
		it('should return relation with nodes, ways and relations', function (done) {
			Api.relation(108723, true).then(function (relation) {
				assert.equal(relation.id, 108723);
				assert.equal(relation.members.length, 143);
				assert.equal(relation._nodes.length, 48);
				assert.equal(relation._ways.length, 95);
				assert.equal(relation._relations.length, 0);
			},
			function (e) {
				throw new Error(util.inspect(e));
			}).then(done, done);
		});
		it('should return 404', function (done) {
			Api.relation(-1).then(function (relation) {
				throw new Error();
			},
			function (e) {
				assert.equal(e.statusCode, 404);
			}).then(done, done);
		});
	});
});