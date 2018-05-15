const mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

// Create model and export
module.exports = mongoose.model("Comment", commentSchema);
