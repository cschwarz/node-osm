module.exports = Api;

var _ = require('underscore');
var Promise = require('es6-promise').Promise;
var request = require('request');

var ApiError = require('./apierror');
var KnownApiUrl = require('./knownapiurl');
var XmlReader = require('./xmlreader');

function Api() {
}

Api.baseUrl = KnownApiUrl.live;

Api.map = function (boundingBox, resolveReferences) {
	return new Promise(function (resolve, reject) {
		resolveReferences = resolveReferences || false;
        
        request.get(Api.baseUrl + 'map',
            { qs: { bbox: boundingBox.toBoundingBoxString() } }, function (error, response, body) {
            if (response.statusCode != 200 || error)
                reject(new ApiError(response.statusCode, error));
            else {
                var xmlReader = new XmlReader();
                var data = xmlReader.read(body);
    
                if (resolveReferences)
                    _resolveReferences(data);
    
                resolve(data);
            }
        });
	});
};

Api.node = function (id) {
	return new Promise(function (resolve, reject) {
        request.get(Api.baseUrl + 'node/' + id, function (error, response, body) {
            if (response.statusCode != 200 || error)
                reject(new ApiError(response.statusCode, error));
            else {
                var xmlReader = new XmlReader();
                var data = xmlReader.read(body);
                resolve(_.first(data.nodes));
            }
        });
	});
};

Api.way = function (id, resolveReferences) {
	return new Promise(function (resolve, reject) {
		resolveReferences = resolveReferences || false;

		var url = Api.baseUrl + 'way/' + id;

		if (resolveReferences)
			url += '/full';

        request.get(url, function (error, response, body) {
            if (response.statusCode != 200 || error)
                reject(new ApiError(response.statusCode, error));
            else {
                var xmlReader = new XmlReader();
                var data = xmlReader.read(body);
    
                if (resolveReferences)
                    _resolveReferences(data);
    
                resolve(_.first(data.ways));
            }
        });
	});
};

Api.relation = function (id, resolveReferences) {
	return new Promise(function (resolve, reject) {
		resolveReferences = resolveReferences || false;

		var url = Api.baseUrl + 'relation/' + id;

		if (resolveReferences)
			url += '/full';

        request.get(url, function (error, response, body) {
            if (response.statusCode != 200 || error)
                reject(new ApiError(response.statusCode, error));
            else {
                var xmlReader = new XmlReader();
                var data = xmlReader.read(body);
    
                if (resolveReferences)
                    _resolveReferences(data);
    
                resolve(_.first(data.relations));
            }
        });
	});
};

function _resolveReferences(data) {
	var nodeCache = _.object(_.map(data.nodes, function (node) { return [node.id, node]; }));
	var wayCache = _.object(_.map(data.ways, function (way) { return [way.id, way]; }));
	var relationCache = _.object(_.map(data.relations, function (relation) { return [relation.id, relation]; }));

	_.each(data.ways, function (way) {
		way._nodes.push.apply(way._nodes, _.values(_.pick(nodeCache, way.nodeReferences)));
	});

	_.each(data.relations, function (relation) {
		relation._nodes.push.apply(relation._nodes, _getEntities(relation.members, nodeCache, 'node'));
		relation._ways.push.apply(relation._ways, _getEntities(relation.members, wayCache, 'way'));
		relation._relations.push.apply(relation._relations, _getEntities(relation.members, relationCache, 'relation'));
	});
}

function _getEntities(members, cache, type) {
	return _.values(_.pick(cache, _.map(_.filter(members,
		function (member) { return member.type == type; }),
		function (member) { return member.reference; })));
}