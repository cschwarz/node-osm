module.exports = Changeset;

function Changeset(id, createdAt, closedAt, open, user, userId, boundingBox) {
    this.id = id;
    this.createdAt = createdAt;
    this.closedAt = closedAt;
    this.open = open;
    this.user = user;
    this.userId = userId;
    this.boundingBox = boundingBox;
    
	this.tags = {};
}