var Entity = require('../entities/entity');

var assert = require('assert');

describe('Entity', function () {
	describe('hasTag()', function () {
        it('entity with tags', function () {
            var entity = new Entity();
            entity.tags.key1 = 'value1';
            entity.tags.key2 = 'value2';

            assert(entity.hasTag('key1'));
            assert(!entity.hasTag('key3'));
            assert(entity.hasTag('key1', 'value1'));
            assert(!entity.hasTag('key1', 'value2'));
            assert(!entity.hasTag('key2', 'value1'));
            assert(!entity.hasTag('key3', 'value3'));
        });
        it('entity without tags', function () {
            var entity = new Entity();

            assert(!entity.hasTag('key1'));
            assert(!entity.hasTag('key1', 'value1'));
        });
	});
});