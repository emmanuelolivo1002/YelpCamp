const express = require('express');
var router = express.Router({mergeParams: true});


const middleware = require('../middleware');

const Comment = require('../models/comment');
const Campground = require('../models/campground');

// COMMENTS ROUTES

//NEW - send to form to create comments
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res) {
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

// EDIT - show comment edit form
router.get("/:comment_id/edit", middleware.checkCommentOwnership,  function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      // req.params.id is campground id
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });

});

// UPDATE - edit comment route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY - delete comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});



module.exports = router;
