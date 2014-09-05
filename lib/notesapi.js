module.exports = NotesApi;

var _ = require('underscore');
var Promise = require('es6-promise').Promise;
var request = require('request');

var ApiError = require('./apierror');
var KnownApiUrl = require('./knownapiurl');
var XmlReader = require('./xmlreader');

var query = require('./util/query');

function NotesApi() {
}

NotesApi.baseUrl = KnownApiUrl.live;

NotesApi.getByBoundingBox = function (boundingBox, limit, closed) {
    return new Promise(function (resolve, reject) {
        var qs = query({
            bbox: boundingBox.toBoundingBoxString(),
            limit: limit,
            closed: closed
        });
        
        request.get({ url: NotesApi.baseUrl + 'notes', qs: qs }, function (error, response, body) {
            if (response.statusCode != 200 || error)
                reject(new ApiError(response.statusCode, error));
            else
                resolve(new XmlReader().readNotes(body));
        });
	});
};

NotesApi.getById = function (id) {
    return new Promise(function (resolve, reject) {
        request.get(NotesApi.baseUrl + 'notes/' + id, function (error, response, body) {
            if (response.statusCode != 200 || error)
                reject(new ApiError(response.statusCode, error));
            else
                resolve(_.first(new XmlReader().readNotes(body)));
        });
	});
};

NotesApi.create = function (location, text) {
    return new Promise(function (resolve, reject) {
        request.post({ url: NotesApi.baseUrl + 'notes',
            qs: { lat: location.latitude, lon: location.longitude, text: text } }, function (error, response, body) {
            if (response.statusCode != 200 || error)
                reject(new ApiError(response.statusCode, error));
            else
                resolve(_.first(new XmlReader().readNotes(body)));
        });
	});
};

NotesApi.comment = function (id, text) {
    return new Promise(function (resolve, reject) {
        request.post({ url: NotesApi.baseUrl + 'notes/' + id + '/comment',
            qs: { text: text } }, function (error, response, body) {
            if (response.statusCode != 200 || error)
                reject(new ApiError(response.statusCode, error));
            else
                resolve(_.first(new XmlReader().readNotes(body)));
        });
	});
};

NotesApi.close = function (id, text) {
    return new Promise(function (resolve, reject) {
        request.post({ url: NotesApi.baseUrl + 'notes/' + id + '/close',
            qs: query({ text: text }) }, function (error, response, body) {
            if (response.statusCode != 200 || error)
                reject(new ApiError(response.statusCode, error));
            else
                resolve(_.first(new XmlReader().readNotes(body)));
        });
	});
};

NotesApi.search = function (query, limit, closed) {
    return new Promise(function (resolve, reject) {
        var qs = query({
            q: query,
            limit: limit,
            closed: closed
        });
        
        request({ url: NotesApi.baseUrl + 'notes/search', qs: qs }, function (error, response, body) {
            if (response.statusCode != 200 || error)
                reject(new ApiError(response.statusCode, error));
            else
                resolve(new XmlReader().readNotes(body));
        });
	});
};