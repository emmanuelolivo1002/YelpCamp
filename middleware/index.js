
const Comment = require('../models/comment');
const Campground = require('../models/campground');

var middlewareObj = {};


middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Need to be logged in first to do that!");
  res.redirect("/login");
}




middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  // Check if user is logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCamp) {
      if (err) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        // Check if user owns campground
        if (foundCamp.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    // if user is not logged in
    req.flash("error", "Need to be logged in first to do that!");
    res.redirect("back");
  }
}



middlewareObj.checkCommentOwnership = function(req, res, next) {
  // Check if user is logged in
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        // Check if user owns comment
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    // if user is not logged in
    req.flash("error", "Need to be logged in first to do that!");
    res.redirect("back");
  }
}


module.exports = middlewareObj;
