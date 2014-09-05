module.exports = NoteComment;

function NoteComment(date, userId, user, action, text, html) {
    this.date = date;
    this.userId = userId;
    this.user = user;
    this.action = action;
    this.text = text;
    this.html = html;
}