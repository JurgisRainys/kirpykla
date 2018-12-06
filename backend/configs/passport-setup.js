const passport = require('passport')
const GoogleStrat = require('passport-google-oauth').OAuth2Strategy
const LocalStrat = require('passport-local').Strategy
const mongoose = require('mongoose')

const keys = require('./keys')
const UserLocal = require('../api/models/userLocal')
const UserGoogle = require('../api/models/userGoogle')

passport.serializeUser((user, done) => {
  done(null, { id: user._id, type: 'googleId' in user ? 'google' : 'local' })
})

passport.deserializeUser((serializedUser, done) => {
  const { id, userType } = serializedUser
  const model = (userType === 'google' ? UserGoogle : UserLocal)

  model
    .findById(id)
    .then((user) => {
      if (!user) return done("no such user in the database")
      done(null, { ...user, token: serializedUser })
    })
    .catch(err => console.log(err))
})

passport.use(
  new LocalStrat(
    { session: false, passReqToCallback: true }, 
    (req, name, pw, done) => {
      // if (req.user) return done(null, req.user)
      done(null, req.user ? req.user : false) 
    }
  )
)

passport.use(
  new GoogleStrat({
      clientID: keys.googleCredentials.clientID,
      clientSecret: keys.googleCredentials.clientSecret,
      callbackURL: '/auth/login/google/callback'
    }, 
    (_, __, profile, done) => {
      UserGoogle
      .findOne({ googleId: profile.id })
      .then(user => {
        if (user) {
          return done(null, user)
        } else {
          return new UserGoogle({
            _id: new mongoose.Types.ObjectId(),
            name: profile.displayName,
            googleId: profile.id,
            role: keys.defaultNewUserRole
          }) 
          .save()
        }
      })
      .then(u => done(null, u))
      .catch(e => done(e))
    })
)

module.exports = passport

  
