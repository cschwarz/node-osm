node-osm
========

A node.js module for working with OpenStreetMap data and the OpenStreetMap API.

XmlChangesetReader
------------------

```javascript
var osm = require('node-osm');

var reader = new osm.XmlChangesetReader();

reader.on('metadata', function (metadata) {
    console.log(metadata);    
});

reader.on('data', function (changesets) {
    console.log(changesets.length);
});

reader.on('end', function () {
    console.log('end');
});

reader.readFile('changesets-latest.osm');
```
