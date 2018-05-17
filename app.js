const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const flash = require('connect-flash');


const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');

// Require routes
const commentRoutes = require('./routes/comments');
const campgroundsRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');


var app = express();

// Connect to database
mongoose.connect("mongodb://localhost/yelp_camp");

//Connect stylesheet
app.use(express.static(__dirname + "/public"));

// Use packages
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());


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
app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);





app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("Listening to server");
});
