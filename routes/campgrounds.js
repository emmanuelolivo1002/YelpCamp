
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
router.post("/", isLoggedIn, function (req, res) {
  // Get data from form
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var newCamp = {name: name, image: image, description: description, author: author }

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
router.get("/new", isLoggedIn, function (req, res) {
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

// EDIT - show edit campground form
router.get("/:id/edit", function(req, res) {
  Campground.findById(req.params.id, function(err, foundCamp) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/edit", {campground: foundCamp});
    }
  });

});

// UPDATE - change campground info
router.put("/:id", function(req, res) {
  // find and update selected campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      //redirect to show page
      res.redirect("/campgrounds/" + req.params.id);
    }
  });

});


// DESTROY - delete campground
router.delete("/:id", function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});


// MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;