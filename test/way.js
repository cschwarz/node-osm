var Node = require('../entities/node');
var Way = require('../entities/way');
var Coordinate = require('../coordinate');
var BoundingBox = require('../boundingbox');

var assert = require('assert');

describe('Way', function () {
	describe('getId()', function () {
		it('should return id prefixed with w', function () {
			var way = new Way();
			way.id = 123;

			assert.equal(way.getId(), 'w123');
		});
	});
	describe('getCenter()', function () {
		it('should return correct center coordinate', function () {
			var way = new Way();
			way._nodes.push(new Node(47, 15));
			way._nodes.push(new Node(49, 17));

			assert.deepEqual(way.getCenter(), new Coordinate(48, 16));
		});
	});
	describe('getBoundingBox()', function () {
		it('should return correct bounding box', function () {
			var way = new Way();
			way._nodes.push(new Node(47, 15));
			way._nodes.push(new Node(49, 17));

			assert.deepEqual(way.getBoundingBox(), new BoundingBox(15, 47, 17, 49));
		});
	});
});