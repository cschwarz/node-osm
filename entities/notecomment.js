module.exports = NoteComment;

function NoteComment(date, action, text, html) {
    this.date = date;
    this.action = action;
    this.text = text;
    this.html = html;
}