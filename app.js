const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Connect to database
mongoose.connect("mongodb://localhost/yelp_camp");

// Setup Schema
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});
// Create model
var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/campgrounds", function (req, res) {

  // Retrieve data from database

  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log("Error retrieving from database");
      console.log(err);
    } else {
      // Render with data Retrieved
      res.render("campgrounds", {campgrounds});
    }
  });
});


app.post("/campgrounds", function (req, res) {
  // Get data from form
  var name = req.body.name;
  var image = req.body.image;

  var newCamp = {name: name, image: image}

  // Create new campground and save to database
  Campground.create(newCamp, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      // Redirect to campgrounds page
      res.redirect("/campgrounds");
    }
  });

});

app.get("/campgrounds/new", function (req, res) {
  res.render("new.ejs");
});

app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("Listening to server");
});
