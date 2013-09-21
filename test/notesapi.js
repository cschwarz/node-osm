var NotesApi = require('../notesapi');
var KnownApiUrl = require('../knownapiurl');

var assert = require('assert');
var util = require('util');

describe('NotesApi', function () {
    before(function () {
        NotesApi.baseUrl = KnownApiUrl.master;
    });
	describe('getById()', function () {
		it('should return note', function (done) {
			NotesApi.getById(148).then(function (note) {
				assert.equal(note.id, 148);
			},
			function (e) {
				throw new Error(util.inspect(e));
			}).then(done, done);
		});
    });
});
		