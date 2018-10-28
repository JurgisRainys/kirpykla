const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport')
const router = express.Router();

const UserLocal = require('../models/userLocal')
const keys = require('../../configs/keys')
// const authenticate = jwt.verify({ secret : keys.jwtSecret });

router.get('/login/google',
  passport.authenticate('google', {
    scope: ['profile']
  })
);

router.get('/login/google/callback', passport.authenticate('google'), (_, resp, __) => 
  resp.redirect('http://localhost:4200')
);


router.post(
  '/register/local',
  register,
  login,
  passport.authenticate('local'),
  generateToken,
  respond
)

router.post(
  '/login/local',  (req, resp) => {
    if (!req.token) resp.status(400).send("no bearer token provided")

    authenticated

  }
)

const authenticated = (token) => {
  try { return { data: jwt.verify(token, keys.jwtSecret) }}
  catch (e) { return { error: e }}
}

const error = (s) => ({ error: s })

const isString = (s) => typeof s === 'string'

function login (req, resp, next) {
  let userInDb = null;
  UserLocal
    .findOne({ name: req.body.username })
    .then(user => {
      if (!user) throw error('user doesn\'t exist.')
      userInDb = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(hashesMatch => {
      if (!hashesMatch) throw error('provided password was incorrect.')
      req.validUser = userInDb
      next()
    })
    .catch(e => {
      if (typeof e === 'object' && 'error' in e) return badReq(e.error)
      else resp.status(500).json(e)
    })
}

function register(req, resp, next) {
  const badReq = s => resp.status(400).json(s)
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
      if (user) throw error(`user with such name already exists. Name: ${name}`)
      return bcrypt.hash(pw1, 10)
    })
    .then(hash => {
      return new UserLocal({
        _id: new mongoose.Types.ObjectId(),
        password: hash,
        name
      }).save()
    })
    .then(_ => {
      req.body = {
        ...req.body,
        username: name,
        password: pw1
      }
      next()
    })
    .catch(e => {
      if (typeof e === 'object' && 'error' in e) return badReq(e.error)
      else resp.status(500).json(e)
    })
}

function generateToken(req, res, next) {  
  req.token = jwt.sign(
    { id: req.user._id }, 
    keys.jwtSecret, 
    { expiresIn: '2h' }
  )
  next()
}

function respond(req, res) {  
  res.status(200).json({
    user: req.body.username,
    token: req.token
  });
}

module.exports = router;
