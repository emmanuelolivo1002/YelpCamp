const mongoose = require('mongoose');

// Setup Schema
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});
// Create model and export
module.exports = mongoose.model("Campground", campgroundSchema);
