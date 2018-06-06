var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NotesSchema = new Schema({
    title: {
        type: String,
    },
    body: {
        type: String,
    }
});

var Note = mongoose.model("Note", NotesSchema);
module.exports = Note;