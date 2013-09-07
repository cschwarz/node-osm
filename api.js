module.exports = Api;

var _ = require('underscore');
var Promise = require('promise');

var XmlReader = require('./xmlreader');
var HttpClient = require('./util/httpclient');

function Api() {
}

Api.map = function (boundingBox, resolveReferences) {
	return new Promise(function (resolve, reject) {
		resolveReferences = resolveReferences || false;
		HttpClient.get('http://api.openstreetmap.org/api/0.6/map?bbox=' + boundingBox.toBoundingBoxString())
		.then(function (result) {
			var xmlReader = new XmlReader();
			var data = xmlReader.read(result);

			if (resolveReferences)
				_resolveReferences(data);

			resolve(data);
		},
		function (e) {
			reject(e);
		}).then(null, function (e) { reject(e); });
	});
};

Api.node = function (id) {
	return new Promise(function (resolve, reject) {
		HttpClient.get('http://api.openstreetmap.org/api/0.6/node/' + id).then(function (result) {
			var xmlReader = new XmlReader();
			var data = xmlReader.read(result);
			resolve(_.first(data.nodes));
		},
		function (e) {
			reject(e);
		}).then(null, function (e) { reject(e); });
	});
};

Api.way = function (id, resolveReferences) {
	return new Promise(function (resolve, reject) {
		resolveReferences = resolveReferences || false;

		var url = 'http://api.openstreetmap.org/api/0.6/way/' + id;

		if (resolveReferences)
			url += '/full';

		HttpClient.get(url).then(function (result) {
			var xmlReader = new XmlReader();
			var data = xmlReader.read(result);

			if (resolveReferences)
				_resolveReferences(data);

			resolve(_.first(data.ways));
		},
		function (e) {
			reject(e);
		}).then(null, function (e) { reject(e); });
	});
};

Api.relation = function (id) {
	return new Promise(function (resolve, reject) {
		HttpClient.get('http://api.openstreetmap.org/api/0.6/relation/' + id).then(function (result) {
			var xmlReader = new XmlReader();
			var data = xmlReader.read(result);
			resolve(_.first(data.relations));
		},
		function (e) {
			reject(e);
		}).then(null, function (e) { reject(e); });
	});
};

function _resolveReferences(data) {
	var nodeCache = _.object(_.map(data.nodes, function (node) { return [node.id, node]; }));
	_.each(data.ways, function (way) {
		way._nodes.push.apply(way._nodes, _.values(_.pick(nodeCache, way.nodeReferences)));
	});
}