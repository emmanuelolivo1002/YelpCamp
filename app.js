const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const seedDB = require('./seeds');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


// Connect to database
mongoose.connect("mongodb://localhost/yelp_camp");

//Seed database
seedDB();

// Passport config
app.use(require("express-session")({
  secret: "opretnqetklr",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// ROUTES
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
      res.render("campgrounds/index", {campgrounds});
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
  res.render("campgrounds/new");
});


// SHOW - shows more info about that campground
app.get("/campgrounds/:id", function(req, res) {
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


// COMMENTS ROUTES

//NEW - send to form to create comments
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
  //Find campground
  Campground.findById(req.params.id, function(err, returnedCamp) {
    if (err) {
      console.log(err);
    } else {

      res.render("comments/new", {campground: returnedCamp});
    }
  });
});

// CREATE - create the comment from the form
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
  //Find campground
  Campground.findById(req.params.id, function(err, returnedCamp) {
    if (err) {
      console.log(err);
    } else {
      // Create comment
      Comment.create(req.body.comment, function(err, createdComment) {
        if (err) {
          console.log(err);
        } else {
          // Associate comment to campground
          returnedCamp.comments.push(createdComment);
          returnedCamp.save();

          // Redirect to campground
          res.redirect("/campgrounds/" + returnedCamp._id);
        }
      });

    }
  });
});


// AUTH ROUTES

// Show register form
app.get("/register", function(req, res) {
  res.render("register");
});

// Handle user registration
app.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/campgrounds");
      });
    }
  });
});

// Show login form
app.get("/login", function(req, res) {
  res.render("login");
});

// Handle user login
app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res) {
});

//Logout

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/campgrounds");
});


// MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("Listening to server");
});
