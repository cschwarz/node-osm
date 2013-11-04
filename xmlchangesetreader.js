module.exports = XmlChangesetReader;

var fs = require('fs');
var libxml = require('libxmljs');
var util = require('util');
var events = require('events');

var BoundingBox = require('./boundingbox');
var Changeset = require('./entities/changeset');
var ChangesetMetadata = require('./entities/changesetmetadata');

function XmlChangesetReader(threshold) {
    events.EventEmitter.call(this);

    this.threshold = threshold || 1000;

    this.changesets = [];
    this.changeset = null;

    this._stream = null;
}

util.inherits(XmlChangesetReader, events.EventEmitter);

XmlChangesetReader.prototype.readString = function (xml) {
    var self = this;

	var parser = new libxml.SaxParser();

    parser.on('startElementNS', function (element, attributes, prefix, uri, namespace) {
        self._startElement(element, attributes);
    });

    parser.on('endElementNS', function (element, prefix, uri) {
        self._endElement(element);
    });

    parser.parseString(xml);
};

XmlChangesetReader.prototype.readFile = function (path) {
	var self = this;

	var parser = new libxml.SaxPushParser();

    parser.on('startElementNS', function (element, attributes, prefix, uri, namespace) {
        self._startElement(element, attributes);
    });

    parser.on('endElementNS', function (element, prefix, uri) {
        self._endElement(element);
    });

    this._stream = fs.createReadStream(path, { encoding: 'utf8' });
    this._stream.on('data', function (data) {
        parser.push(data);
    });
};

XmlChangesetReader.prototype.pause = function () {
    if (this._stream)
        this._stream.pause();
};

XmlChangesetReader.prototype.resume = function () {
    if (this._stream)
        this._stream.resume();
};

XmlChangesetReader.prototype._startElement = function (element, attributes) {
    if (element === 'changeset') {
        this.changeset = new Changeset();

        this.changeset.id = parseInt(this._getAttribute(attributes, 'id'), 10);
        this.changeset.createdAt = new Date(this._getAttribute(attributes, 'created_at'));

        if (this._hasAttribute(attributes, 'closed_at'))
            this.changeset.closedAt = new Date(this._getAttribute(attributes, 'closed_at'));

        if (this._hasAttribute(attributes, 'num_changes'))
            this.changeset.changeCount = parseInt(this._getAttribute(attributes, 'num_changes'), 10);

        this.changeset.open = this._getAttribute(attributes, 'open') === 'true' ? true : false;

        if (this._hasAttribute(attributes, 'user'))
            this.changeset.user = this._getAttribute(attributes, 'user');

        if (this._hasAttribute(attributes, 'uid'))
            this.changeset.userId = parseInt(this._getAttribute(attributes, 'uid'), 10);

        if (this._hasAttribute(attributes, 'min_lon') && this._hasAttribute(attributes, 'min_lat') &&
            this._hasAttribute(attributes, 'max_lon') && this._hasAttribute(attributes, 'max_lat'))
            this.changeset.boundingBox = new BoundingBox(parseFloat(this._getAttribute(attributes, 'min_lon')),
                                                         parseFloat(this._getAttribute(attributes, 'min_lat')),
                                                         parseFloat(this._getAttribute(attributes, 'max_lon')),
                                                         parseFloat(this._getAttribute(attributes, 'max_lat')));
    }
    else if (element === 'tag') {
        var key = this._getAttribute(attributes, 'k');
        var value = this._getAttribute(attributes, 'v');

        if (key !== '' && value !== '')
            this.changeset.tags[key] = value;
    }
    else if (element === 'osm') {
        var changesetMetadata = new ChangesetMetadata();

        changesetMetadata.generator = this._getAttribute(attributes, 'generator');
        changesetMetadata.attribution = this._getAttribute(attributes, 'attribution');
        changesetMetadata.copyright = this._getAttribute(attributes, 'copyright');
        changesetMetadata.license = this._getAttribute(attributes, 'license');
        changesetMetadata.version = this._getAttribute(attributes, 'version');

        if (this._hasAttribute(attributes, 'timestamp'))
            changesetMetadata.timestamp = new Date(this._getAttribute(attributes, 'timestamp'));

        this.emit('metadata', changesetMetadata);
    }
};

XmlChangesetReader.prototype._endElement = function (element) {
    if (element === 'changeset') {
        this.changesets.push(this.changeset);

        if (this.changesets.length >= this.threshold) {
            this.emit('data', this.changesets.slice());
            this.changesets.length = 0;
        }
    }
    else if (element === 'osm' && this.changesets.length > 0) {
        this.emit('data', this.changesets.slice());
        this.changesets.length = 0;
        this.emit('end');
    }
    else if (element === 'osm') {
        this.emit('end');
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