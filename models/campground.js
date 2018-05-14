const mongoose = require('mongoose');

// Setup Schema
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
// Create model and export
module.exports = mongoose.model("Campground", campgroundSchema);
