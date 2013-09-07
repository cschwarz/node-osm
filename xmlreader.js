module.exports = XmlReader;

var libxmljs = require('libxmljs');

var Node = require('./entities/node');
var Way = require('./entities/way');
var Relation = require('./entities/relation');
var Member = require('./entities/member');
var Data = require('./entities/data');

function XmlReader() {
}

XmlReader.prototype.read = function (xml) {
	var data = new Data();

	var xmlDocument = libxmljs.parseXml(xml);
	var childNodes = xmlDocument.root().childNodes();

	for (var i = 0; i < childNodes.length; i++) {
		switch (childNodes[i].name()) {
		case 'node':
			data.nodes.push(this._readNode(childNodes[i]));
			break;
		case 'way':
			data.ways.push(this._readWay(childNodes[i]));
			break;
		case 'relation':
			data.relations.push(this._readRelation(childNodes[i]));
			break;
		}
	}

	return data;
};

XmlReader.prototype._readNode = function (element) {
	var node = new Node();

	node.id = parseInt(element.attr('id').value(), 10);
	node.latitude = parseFloat(element.attr('lat').value());
	node.longitude = parseFloat(element.attr('lon').value());

	var childNodes = element.childNodes();

	for (var i = 0; i < childNodes.length; i++) {
		if (childNodes[i].name() == 'tag')
			node.tags[childNodes[i].attr('k').value()] = childNodes[i].attr('v').value();
	}

	return node;
};

XmlReader.prototype._readWay = function (element) {
	var way = new Way();

	way.id = parseInt(element.attr('id').value(), 10);

	var childNodes = element.childNodes();

	for (var i = 0; i < childNodes.length; i++) {
		if (childNodes[i].name() == 'tag')
			way.tags[childNodes[i].attr('k').value()] = childNodes[i].attr('v').value();
		else if (childNodes[i].name() == 'nd')
			way.nodeReferences.push(parseInt(childNodes[i].attr('ref').value(), 10));
	}

	return way;
};

XmlReader.prototype._readRelation = function (element) {
	var relation = new Relation();

	relation.id = parseInt(element.attr('id').value(), 10);

	var childNodes = element.childNodes();

	for (var i = 0; i < childNodes.length; i++) {
		if (childNodes[i].name() == 'tag')
			relation.tags[childNodes[i].attr('k').value()] = childNodes[i].attr('v').value();
		else if (childNodes[i].name() == 'member')
			relation.members.push(new Member(childNodes[i].attr('type').value(),
				childNodes[i].attr('ref').value(),
				childNodes[i].attr('role').value()));
	}

	return relation;
};