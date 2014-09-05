module.exports = Note;

function Note(id, latitude, longitude, dateCreated, dateClosed, status) {
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    
    this.dateCreated = dateCreated;
    this.dateClosed = dateClosed;
    
    this.status = status;
    
    this.comments = [];
}