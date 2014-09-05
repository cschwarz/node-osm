module.exports = ApiError;

function ApiError(statusCode, message) {
	this.statusCode = statusCode;
	this.message = message;
}