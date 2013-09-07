var Node = require('../entities/node');
var Coordinate = require('../coordinate');
var BoundingBox = require('../boundingbox');

var assert = require('assert');

describe('Node', function () {
	describe('getId()', function () {
		it('should return id prefixed with n', function () {
			var node = new Node();
			node.id = 123;

			assert.equal(node.getId(), 'n123');
		});
	});
	describe('getCenter()', function () {
		it('should return correct center coordinate', function () {
			var node = new Node(48, 16);

			assert.deepEqual(node.getCenter(), new Coordinate(48, 16));
		});
	});
	describe('getBoundingBox()', function () {
		it('should return correct bounding box', function () {
			var node = new Node(48, 16);

			assert.deepEqual(node.getBoundingBox(), new BoundingBox(16, 48, 16, 48));
		});
	});
});