var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

const priceRoutes = require('./api/routes/prices');

mongoose.connect('mongodb://localhost:27017/kirpykla', { useNewUrlParser: true });

// app.use(express.static(path.join(__dirname, './static')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// kad body isparsintu
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/prices', priceRoutes)

module.exports = app;