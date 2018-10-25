const express = require('express');
const mongoose = require('mongoose');
const http = require('http')
const url = require('url')
const passport = require('passport')
const router = express.Router();

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile']
  })
);

router.get('/google/callback', passport.authenticate('google'), (_, resp, __) => 
  resp.redirect('http://localhost:4200')
);

// router.post('/local', (req, resp, next) => { console.log("DDASDASD")})

router.post('/local', (req, resp, next) => {
  const user = req.body.username
  const pw1 = req.body.password
  const pw2 = req.body.password

  if (pw1 === pw2) {
    const token = getToken(user, pw1)
    console.log(token)

  } else {
    resp.status(400).json("passwords dont match")
  }
})

const getToken = (name, password) => {
  return "asdkakjsdlk"
}

module.exports = router;
