const passport = require('passport')
const GoogleStrat = require('passport-google-oauth').OAuth2Strategy
const LocalStrat = require('passport-local')
const keys = require('./keys')
const User = require('../api/models/user')
const mongoose = require('mongoose')

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((_id, done) => {
  User.findById(_id).then((user) => 
    done(null, user)
  )
})

passport.use(
  new GoogleStrat({
    clientID: keys.googleCredentials.clientID,
    clientSecret: keys.googleCredentials.clientSecret,
    callbackURL: '/auth/google/callback'
  }, 
  (_, __, profile, done) => {
    User
    .findOne({ googleId: profile.id})
    .then(user => {
      if (user) {
        return done(null, user)
      } else {
        new User({
          _id: new mongoose.Types.ObjectId(),
          name: profile.displayName,
          googleId: profile.id,
          gender: profile.gender,
          services: []
        }) 
        .save()
        .then(u => done(null, u))
        .catch(e => done(e))
      }
    })
    .catch(e => done(e))
    // send cookie back with userId
  })
  // }),
  // new LocalStrat(  
  //   function(username, password, done) {
  //     // database dummy - find user and verify password
  //     if(username === 'devils name' && password === '666'){
  //       done(null, {
  //         id: 666,
  //         firstname: 'devils',
  //         lastname: 'name',
  //         email: 'devil@he.ll',
  //         verified: true
  //       });
  //     }
  //     else {
  //       done(null, false);
  //     }
  //   }
  // )
)

module.exports = passport