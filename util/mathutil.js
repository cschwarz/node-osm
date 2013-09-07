module.exports = MathUtil;

function MathUtil() {
}

var radiansFactor = (Math.PI / 180.0);
var earthRadius = 6371000.0;

MathUtil.getDistance = function (coordinate1, coordinate2) {
	var latitudeDelta = (coordinate2.latitude - coordinate1.latitude) * radiansFactor;
	var longitudeDelta = (coordinate2.longitude - coordinate1.longitude) * radiansFactor;
	var latitude1 = coordinate1.latitude * radiansFactor;
	var latitude2 = coordinate2.latitude * radiansFactor;

	var a = Math.sin(latitudeDelta / 2.0) * Math.sin(latitudeDelta / 2.0) +
			Math.sin(longitudeDelta / 2.0) * Math.sin(longitudeDelta / 2.0) * Math.cos(latitude1) * Math.cos(latitude2);
	var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));

	return earthRadius * c;
};