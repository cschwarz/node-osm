module.exports = NotesApi;

var _ = require('underscore');
var Promise = require('promise');

var KnownApiUrl = require('./knownapiurl');
var HttpClient = require('./util/httpclient');

function NotesApi() {
}

NotesApi.baseUrl = KnownApiUrl.live;

NotesApi.getByBoundingBox = function (boundingBox, limit, closed) {
};

NotesApi.getById = function (id) {
    return new Promise(function (resolve, reject) {
		HttpClient.get(NotesApi.baseUrl + 'notes/' + id + '.json').then(function (result) {
            resolve(JSON.parse(result).properties);
		},
		function (e) {
			reject(e);
		}).then(null, function (e) { reject(e); });
	});
};

NotesApi.create = function (location, text) {
};

NotesApi.comment = function (noteId, text) {
};

NotesApi.close = function (noteId) {
};

NotesApi.search = function (query, limit, closed) {
};