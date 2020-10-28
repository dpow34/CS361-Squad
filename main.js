// Set up app, point to public dir
var express = require('express');
var app = express();
app.use('/static', express.static('public'));

// Connect to the database
var mysql = require('./public/js/dbcon.js');
app.set('mysql', mysql); 

// require body parser to form data handlebars from html template
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
var handlebars = require('express-handlebars').create(
  {
    defaultLayout:'main'
  }
);

app.engine("handlebars", handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', 3023);

// route for home page
app.get("/", function(req, res)
{
  let context = {}
  context.cssstyles = ["main.css"]
  res.render('home', context);
})

app.use('/customers', require('./public/js/customers.js'));

app.use('/repairs', require('./public/js/repairs.js'));

app.use('/items', require('./public/js/items.js'));

app.use('/sales', require('./public/js/sales.js'));


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