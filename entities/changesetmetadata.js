module.exports = ChangesetMetadata;

function ChangesetMetadata(generator, attribution, copyright, license, version, timestamp) {
    this.generator = generator;
    this.attribution = attribution;
    this.copyright = copyright;
    this.license = license;
    this.version = version;
    this.timestamp = timestamp;
}