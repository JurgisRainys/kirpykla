const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport')
const router = express.Router();
const jwt = require('jsonwebtoken')

const UserLocal = require('../models/userLocal')
const defaultNewUserRole = require('../../configs/keys').defaultNewUserRole
const keys = require('../../configs/keys')

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
  successfulLogin
)

router.post('/login/local',
  login,
  generateToken,
  passport.authenticate('local'),
  successfulLogin
)

router.post(
  '/register/local',
  register,
  login,
  generateToken,
  passport.authenticate('local'),
  successfulLogin
)

const error = (s) => ({ error: s })

const isString = (s) => typeof s === 'string'

function login (req, resp, next) {
  const badReq = s => resp.status(400).json(s)
  let userInDb = null;
  console.log(req.token)

  if (req.cookie && req.cookie.jwt) {
    try {
      console.log(req.cookie.jwt)
      var decoded = jwt.verify(req.cookie.jwt, keys.jwtSecret)
      req.body.username = decoded.name
      req.body.password = decoded.password      
    } catch (_) {
      return resp.status(400).json("token invalid")
    }
  }

  if (!req.body.username) return resp.status(400).json("no username provided")
  if (!req.body.password) return resp.status(400).json("no password provided")

  UserLocal
    .findOne({ name: req.body.username })
    .then(user => {
      if (!user) throw error('user doesn\'t exist.')
      userInDb = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(hashesMatch => {
      if (!hashesMatch) throw error('provided password was incorrect.')
      req.user = userInDb
      
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
        role: defaultNewUserRole,
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

function successfulLogin(req, resp) {
  const token = jwt.sign({ id: req.user._id, user: req.user.username }, keys.jwtSecret)
  resp.status(200).send({ user: req.user, token })
}

function generateToken(req, res, next) {  
  req.token = jwt.sign(
    { id: req.user._id }, 
    keys.jwtSecret, 
    { expiresIn: '2h' }
  )
  res.cookie('jwt', req.token)
  next()
}

module.exports = router;
