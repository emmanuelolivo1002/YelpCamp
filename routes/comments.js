const express = require('express');
var router = express.Router({mergeParams: true});

const Comment = require('../models/comment');
const Campground = require('../models/campground');

// COMMENTS ROUTES

//NEW - send to form to create comments
router.get("/new", isLoggedIn, function(req, res) {
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
router.post("/", isLoggedIn, function(req, res) {
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
          // Add username and id to comment
          createdComment.author.id = req.user._id;
          createdComment.author.username = req.user.username;

          //Save comment
          createdComment.save();
          
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

// MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


module.exports = router;
