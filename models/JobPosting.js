var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var JobPostingschema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true,
    },
    compName: {
        type: String,
        default: "There is no Company Name for this posting."
    },
    desc: {
        type: String,
        default: "There is no Job Description for this posting."
    },
    isSaved: {
        type: Boolean,
        default: false
    },
    isWebDev: {
        type: Boolean,
        default: false
    },
    isFullStackDev: {
        type: Boolean,
        default: false
    },
    isFrontEndDev: {
        type: Boolean,
        default: false
    },
    isBackEndDev: {
        type: Boolean,
        default: false
    },
    isUiUxDev: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "Save Article"
    },
    created: {
        type: Date,
        default: Date.now
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

JobPostingschema.index({
    title: "text"
});

var Posting = mongoose.model("Posting", JobPostingschema);
module.exports = Posting;