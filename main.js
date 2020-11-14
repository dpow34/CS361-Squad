var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var path = require('path');
app.use('/static', express.static('public'));

// require body parser to form data handlebars from html template
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
var handlebars = require('express-handlebars').create(
  {
    defaultLayout:'main',
    layoutsDir: path.join[__dirname, 'views/layouts/'],
    partialsDir: path.join[__dirname, 'views/partials/']
  }
);

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set('port', 3023);

// route for home page
app.get("/", function(req, res)
{
  let context = {}
  context.cssstyles = ["home.css"];
  context.jsscripts = ["homePage.js"];
  res.cookie("zipCode", "11719");
  res.render('home', context);
})

//this is server side-code for the userProfile page (not js sent to client)
app.use('/userProfile', require('./public/js/userProfile.js'));

//this is server side-code for the nearbyTrails page (not js sent to client)
app.use('/nearbyTrails', require('./public/js/nearbyTrails'));

//this is server side-code for the gear page (not js sent to client)
app.use('/gear', require('./public/js/gear.js'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
  });