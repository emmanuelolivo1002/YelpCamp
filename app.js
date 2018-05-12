const express = require('express');
const bodyParser = require('body-parser');
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Temp array
var campgrounds = [
  {name: "Salmon", image: "https://i0.wp.com/scoutingmagazine.org/wp-content/uploads/2008/05/Summer-Camp.jpg?ssl=1"},
  {name: "Tuna", image: "http://www.camp-liza.com/wp-content/uploads/2017/10/20170708_093155_HDR-1.jpg"},
  {name: "Mars", image: "http://www.sanctuaryretreats.com/media/5313445/sanctuary-baines-camp-starbath.jpg"}
];



app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/campgrounds", function (req, res) {

  res.render("campgrounds", {campgrounds});

});


app.post("/campgrounds", function (req, res) {
  // Get data from form
  var name = req.body.name;
  var image = req.body.image;

  var newCamp = {name: name, image: image}

  campgrounds.push(newCamp);

  // Redirect to campgrounds page
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function (req, res) {
  res.render("new.ejs");
});

app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("Listening to server");
});
