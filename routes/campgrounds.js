
const express = require('express');
var router = express.Router();

const Campground = require('../models/campground');


// INDEX - Show all campgrounds
router.get("/", function (req, res) {

  // Retrieve data from database

  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log("Error retrieving from database");
      console.log(err);
    } else {
      // Render with data Retrieved
      res.render("campgrounds/index", {campgrounds});
    }
  });
});

// CREATE - Add new campground to database
router.post("/", function (req, res) {
  // Get data from form
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;

  var newCamp = {name: name, image: image, description: description }

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

// NEW - show form to create campgrounds
router.get("/new", function (req, res) {
  res.render("campgrounds/new");
});


// SHOW - shows more info about that campground
router.get("/:id", function(req, res) {
  //Find campground with provided id
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
    if (err) {
      console.log(err);
    } else {
      // Render show template with correct info
      res.render("campgrounds/show", {campground: foundCamp});
    }
  });
});

module.exports = router;
