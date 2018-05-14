const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Campground = require('./models/campground');

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Connect to database
mongoose.connect("mongodb://localhost/yelp_camp");


app.get("/", function (req, res) {
  res.render("landing");
});

// INDEX - Show all campgrounds
app.get("/campgrounds", function (req, res) {

  // Retrieve data from database

  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log("Error retrieving from database");
      console.log(err);
    } else {
      // Render with data Retrieved
      res.render("index", {campgrounds});
    }
  });
});

// CREATE - Add new campground to database
app.post("/campgrounds", function (req, res) {
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
app.get("/campgrounds/new", function (req, res) {
  res.render("new.ejs");
});


// SHOW - shows more info about that campground
app.get("/campgrounds/:id", function(req, res) {
  //Find campground with provided id
  Campground.findById(req.params.id, function(err, foundCamp) {
    if (err) {
      console.log(err);
    } else {
      // Render show template with correct info
      res.render("show", {campground: foundCamp});
    }
  });
});


app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("Listening to server");
});
