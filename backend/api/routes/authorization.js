const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport')
const router = express.Router();

const UserLocal = require('../models/userLocal')
const defaultNewUserRole = require('../../configs/keys').defaultNewUserRole
const helpers = require('./helpers')

router.get('/login/google', 
  passport.authenticate('google', {
    scope: ['profile']
  })
);

router.get('/', (req, resp) => {
  resp.status(200).json({ user: req.user.name })
})

router.get(
  '/login/google/callback',
  passport.authenticate('google'), 
  (req, resp) => {
    // resp.cookie('authJWT', helpers.generateToken(req.user), { expires: new Date(Date.now() + 3600 * 1000) })
    resp.redirect('http://localhost:4200')
  }
)

router.post(
  '/login/local',
  loginLocal,
  respondWithToken
)

router.post(
  '/register/local',
  registerLocal,
  loginLocal,
  respondWithToken
)

router.post(
  '/logout/local',
  logoutLocal,
  okResponse
)

const isString = (s) => typeof s === 'string'

function loginLocal (req, resp, next) {
  const badReq = helpers.badReq(resp)
  let userInDb = null;

  if (!req.body.username) return badReq(helpers.error("Neįrašėte vartotojo vardo"))
  if (!req.body.password) return badReq(helpers.error("Neįrašėte vartotojo slaptažodžio"))

  UserLocal
    .findOne({ name: req.body.username })
    .then(user => {
      if (!user) throw helpers.error('Vartotojas neegzistuoja')
      userInDb = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(hashesMatch => {
      if (!hashesMatch) throw helpers.error('Vartotojo slaptažodis neteisingas')
      const authJWT = helpers.generateToken({
        _id: userInDb._id,
        name: userInDb.name,
        password: userInDb.password,
        role: userInDb.role 
      })
      resp.cookie('authJWT', authJWT)
      req.token = authJWT
      req.user = userInDb
      next()
    })
    .catch(e => {
      if (typeof e === 'object' && 'error' in e) return badReq(e)
      else resp.status(500).json(e)
    })
}

function registerLocal(req, resp, next) {
  const badReq = helpers.badReq(resp)
  const pw1 = req.body.password1
  const pw2 = req.body.password2
  const name = req.body.username

  if (!(pw1 && pw2 && name)) 
    return badReq("request body must have these members: username, password1, password2.")

  if (!(isString(pw1) && isString(pw2) && isString(name)))
    return badReq("username, password1, password2 must all be strings.")

  if (pw1 !== pw2) 
    return badReq("passwords don't match.")

  UserLocal
    .findOne({ name })
    .then(user => {
      if (user) throw helpers.error(`Vartotojas šiuo vardu jau egzistuoja`)
      return bcrypt.hash(pw1, 10)
    })
    .then(hash => {
      return new UserLocal({
        _id: new mongoose.Types.ObjectId(),
        role: defaultNewUserRole,
        password: hash,
        name
      }).save()
    })
    .then(_ => {
      req.body = {
        username: name,
        password: pw1
      }
      next()
    })
    .catch(e => {
      if (typeof e === 'object' && 'error' in e) return badReq(e)
      else resp.status(500).json({ error: e })
    })
}

function logoutLocal(req, resp, next) {
  resp.clearCookie('authJWT')
  next()
}

function okResponse(req, resp) {
  resp.status(200).send()
}

function respondWithToken(req, resp) {
  resp.status(200).json({ token: req.token })
}

module.exports = router;
