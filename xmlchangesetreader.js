module.exports = XmlChangesetReader;

var fs = require('fs');
var libxml = require('libxmljs');

var BoundingBox = require('./boundingbox');
var Changeset = require('./entities/changeset');

function XmlChangesetReader(threshold) {
    this.threshold = threshold || 1000;
}

XmlChangesetReader.prototype.readString = function (xml, callback) {
    var self = this;
    
	var changesets = [];
    var changeset = null;

	var parser = new libxml.SaxParser();
    
    parser.on('startElementNS', function (element, attributes, prefix, uri, namespace) {
        changeset = self._startElement(element, attributes, changeset);
    });
    
    parser.on('endElementNS', function (element, prefix, uri) {
        self._endElement(element, changesets, changeset, callback);
    });
    
    parser.parseString(xml);
};

XmlChangesetReader.prototype.readFile = function (path, callback) {
	var self = this;
    
	var changesets = [];
    var changeset = null;

	var parser = new libxml.SaxPushParser();
    
    parser.on('startElementNS', function (element, attributes, prefix, uri, namespace) {
        changeset = self._startElement(element, attributes, changeset);
    });
    
    parser.on('endElementNS', function (element, prefix, uri) {
        self._endElement(element, changesets, changeset, callback);
    });
        
    fs.createReadStream(path, { encoding: 'utf8' }).on('data', function (data) { parser.push(data); });
};

XmlChangesetReader.prototype._startElement = function (element, attributes, changeset) {
    if (element === 'changeset') {
        changeset = new Changeset();
        
        changeset.id = parseInt(this._getAttribute(attributes, 'id'), 10);
        changeset.createdAt = new Date(this._getAttribute(attributes, 'created_at'));
        
        if (this._hasAttribute(attributes, 'closed_at'))
            changeset.closedAt = new Date(this._getAttribute(attributes, 'closed_at'));
        
        changeset.open = this._getAttribute(attributes, 'open') === 'true' ? true : false;
        
        if (this._hasAttribute(attributes, 'user'))
            changeset.user = this._getAttribute(attributes, 'user');
        
        if (this._hasAttribute(attributes, 'uid'))
            changeset.userId = parseInt(this._getAttribute(attributes, 'uid'), 10);
        
        if (this._hasAttribute(attributes, 'min_lon') && this._hasAttribute(attributes, 'min_lat') &&
            this._hasAttribute(attributes, 'max_lon') && this._hasAttribute(attributes, 'max_lat'))
            changeset.boundingBox = new BoundingBox(parseFloat(this._getAttribute(attributes, 'min_lon')),
                                                    parseFloat(this._getAttribute(attributes, 'min_lat')),
                                                    parseFloat(this._getAttribute(attributes, 'max_lon')),
                                                    parseFloat(this._getAttribute(attributes, 'max_lat')));
        
        
        changeset.id = this._getAttribute(attributes, 'id');
    }
    else if (element === 'tag') {
        changeset.tags[this._getAttribute(attributes, 'k')] = this._getAttribute(attributes, 'v');
    }
    
    return changeset;
};

XmlChangesetReader.prototype._endElement = function (element, changesets, changeset, callback) {
    if (element === 'changeset') {
        changesets.push(changeset);
        
        if (changesets.length >= this.threshold) {
            callback(changesets);
            changesets.length = 0;
        }
    } else if (element === 'osm' && changesets.length > 0) {
        callback(changesets);
        changesets.length = 0;
    }
};

XmlChangesetReader.prototype._hasAttribute = function (attributes, name) {
    for (var i = 0; i < attributes.length; i++) {
        if (attributes[i][0] === name)
            return true;
    }
    
    return false;
};

XmlChangesetReader.prototype._getAttribute = function (attributes, name) {
    for (var i = 0; i < attributes.length; i++) {
        if (attributes[i][0] === name)
            return attributes[i][3];
    }
};