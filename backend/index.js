var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
const passport = require('./configs/passport-setup')  

const priceRoutes = require('./api/routes/prices');
const authorizationRoutes = require('./api/routes/authorization')
const hairdresserRoutes = require('./api/routes/hairdressers')
const reservationRoutes = require('./api/routes/reservations')
const cookieKey = require('./configs/keys').cookieKey
mongoose.connect('mongodb://localhost:27017/kirpykla', { useNewUrlParser: true });

// app.use(express.static(path.join(__dirname, './static')));

// kad body isparsintu
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(require('cookie-session')({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [cookieKey]
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(function(_, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Auth-Token, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/prices', priceRoutes)
app.use('/auth', authorizationRoutes)
app.use('/hairdressers', hairdresserRoutes)
app.use('/reservations', reservationRoutes)

module.exports = app;