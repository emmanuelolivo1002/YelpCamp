const express = require('express');
var router = express.Router();
const passport = require('passport');

const User = require('../models/user');


// Root route
router.get("/", function (req, res) {
  res.render("landing");
});


// AUTH ROUTES

// Show register form
router.get("/register", function(req, res) {
  res.render("register");
});

// Handle user registration
router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      // Show message
      req.flash("error", err.message);
      return res.redirect('register');
    } else {
      passport.authenticate("local")(req, res, function() {
        req.flash("success", "Successfully signed up");
        res.redirect("/campgrounds");
      });
    }
  });
});

// Show login form
router.get("/login", function(req, res) {
  res.render("login");
});

// Handle user login
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res) {
});

//Logout

router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});



module.exports = router;
