module.exports = XmlReader;

var libxmljs = require('libxmljs');

var Node = require('./entities/node');
var Way = require('./entities/way');
var Relation = require('./entities/relation');
var Member = require('./entities/member');
var Data = require('./entities/data');

var Note = require('./entities/note');
var NoteComment = require('./entities/notecomment');

function XmlReader() {
}

XmlReader.prototype.read = function (xml) {
	var data = new Data();

	var xmlDocument = libxmljs.parseXml(xml);
	var childNodes = xmlDocument.root().childNodes();

	for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].type() != 'element')
            continue;
        
        if (childNodes[i].name() == 'node')
			data.nodes.push(this._readNode(childNodes[i]));
        else if (childNodes[i].name() == 'way')
			data.ways.push(this._readWay(childNodes[i]));
        else if (childNodes[i].name() == 'relation')
			data.relations.push(this._readRelation(childNodes[i]));
	}

	return data;
};

XmlReader.prototype.readNotes = function (xml) {
	var notes = [];

	var xmlDocument = libxmljs.parseXml(xml);
	var childNodes = xmlDocument.root().childNodes();

	for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].type() != 'element')
            continue;
        
		if (childNodes[i].name() == 'note')
			notes.push(this._readNote(childNodes[i]));
    }

	return notes;
};

XmlReader.prototype._readNode = function (element) {
	var node = new Node();

	node.id = parseInt(element.attr('id').value(), 10);
	node.latitude = parseFloat(element.attr('lat').value());
	node.longitude = parseFloat(element.attr('lon').value());

	var childNodes = element.childNodes();

	for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].type() != 'element')
            continue;
        
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
        if (childNodes[i].type() != 'element')
            continue;
        
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
        if (childNodes[i].type() != 'element')
            continue;
        
		if (childNodes[i].name() == 'tag')
			relation.tags[childNodes[i].attr('k').value()] = childNodes[i].attr('v').value();
		else if (childNodes[i].name() == 'member')
			relation.members.push(new Member(childNodes[i].attr('type').value(),
				childNodes[i].attr('ref').value(),
				childNodes[i].attr('role').value()));
	}

	return relation;
};

XmlReader.prototype._readNote = function (element) {
	var note = new Note();

	note.latitude = parseFloat(element.attr('lat').value());
	note.longitude = parseFloat(element.attr('lon').value());

	var childNodes = element.childNodes();

	for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].type() != 'element')
            continue;
        
        if (childNodes[i].name() == 'id')
            note.id = parseInt(childNodes[i].text(), 10);
		else if (childNodes[i].name() == 'date_created')
			note.dateCreated = new Date(childNodes[i].text());
		else if (childNodes[i].name() == 'status')
			note.status = childNodes[i].text();
		else if (childNodes[i].name() == 'date_closed')
			note.dateClosed = new Date(childNodes[i].text());
        else if (childNodes[i].name() == 'comments')
            note.comments.push.apply(note.comments, this._readNoteComments(childNodes[i]));
	}

	return note;
};

XmlReader.prototype._readNoteComments = function (element) {
    var noteComments = [];
    
    var childNodes = element.childNodes();
 
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].type() != 'element')
            continue;
        
        if (childNodes[i].name() == 'comment')
            noteComments.push(this._readNoteComment(childNodes[i]));
    }
    
    return noteComments;
};

XmlReader.prototype._readNoteComment = function (element) {
	var noteComment = new NoteComment();
        
    var childNodes = element.childNodes();

	for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].type() != 'element')
            continue;
        
        if (childNodes[i].name() == 'date')
            noteComment.date = new Date(childNodes[i].text());
		else if (childNodes[i].name() == 'action')
			noteComment.action = childNodes[i].text();
		else if (childNodes[i].name() == 'text')
			noteComment.text = childNodes[i].text();
		else if (childNodes[i].name() == 'html')
			noteComment.html = childNodes[i].text();
	}
    
	return noteComment;
};