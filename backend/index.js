const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bearerTokenParser = require('express-bearer-token')
const app = express();
const cookieparser = require('cookie-parser')
const passport = require('./configs/passport-setup')  

const priceRoutes = require('./api/routes/prices')
const authorizationRoutes = require('./api/routes/authorization')
const hairdresserRoutes = require('./api/routes/hairdressers')
const reservationRoutes = require('./api/routes/reservations')
const userRoutes = require('./api/routes/users')

const cookieKey = require('./configs/keys').cookieKey
mongoose.connect('mongodb://localhost:27017/kirpykla', { useNewUrlParser: true });

// app.use(express.static(path.join(__dirname, './static')));

app.use(cookieparser())
app.use(bearerTokenParser())

// kad body isparsintu
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(require('cookie-session')({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [cookieKey],
  httpOnly: false,
  path: '/',
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
app.use('/users', userRoutes)

module.exports = app;