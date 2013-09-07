module.exports = HttpClient;

var http = require('http');
var Promise = require('promise');

function HttpClient() {
}

HttpClient.get = function (url) {
	return new Promise(function (resolve, reject) {
		http.get(url, function (res) {
			if (res.statusCode != 200)
			{
				reject({ statusCode: res.statusCode });
				return;
			}

			var body = '';

			res.on('data', function (chunk) {
				body += chunk;
			});

			res.on('end', function () {
				resolve(body);
			});
		}).on('error', function (e) {
			reject(e);
		});
	});
};