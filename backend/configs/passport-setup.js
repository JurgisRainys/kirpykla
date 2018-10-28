const passport = require('passport')
const GoogleStrat = require('passport-google-oauth').OAuth2Strategy
const LocalStrat = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const keys = require('./keys')
const UserLocal = require('../api/models/userLocal')

passport.serializeUser((user, done) => {
  console.log("serializeUser: ", user)
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
  console.log("deserialize: ", id)
  UserLocal
    .findById(id)
    .then((user) => {
      done(null, user)
    })
    .catch(err => console.log(err))
})

passport.use(
  new LocalStrat(
    { session: false, passReqToCallback: true }, 
    (req, _, __, done) => done(null, req.validUser ? req.validUser : false)
  )
)

module.exports = passport

  // new GoogleStrat({
    //   clientID: keys.googleCredentials.clientID,
    //   clientSecret: keys.googleCredentials.clientSecret,
    //   callbackURL: '/auth/google/callback'
    // }, 
    // (_, __, profile, done) => {
    //   User
    //   .findOne({ googleId: profile.id})
    //   .then(user => {
    //     if (user) {
    //       return done(null, user)
    //     } else {
    //       new User({
    //         _id: new mongoose.Types.ObjectId(),
    //         name: profile.displayName,
    //         googleId: profile.id,
    //         gender: profile.gender
    //       }) 
    //       .save()
    //       .then(u => done(null, u))
    //       .catch(e => done(e))
    //     }
    //   })
    //   .catch(e => done(e))
    //   // send cookie back with userId
    // }),
