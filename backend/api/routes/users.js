const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const UserGoogle = require('../models/userGoogle');
const UserLocal = require('../models/userLocal');
const passport = require('passport')

router.get('/', passport.authenticate('local'), (req, resp, __) => {
  if (!req.isAuthenticated()) return resp.status(401).send()

  UserGoogle
  .find()
  .then(googleUsers => {
    UserLocal
    .find()
    .then(localUsers => resp.status(200).json({ googleUsers, localUsers }))
    .catch(e => {
      console.log(e)
      resp.status(400).json(e)
    })
  })
  .catch(e => {
    console.log(e)
    resp.status(400).json(e)
  })
});

router.delete('/:id', passport.authenticate('local'), (req, resp, _) => {
  if (!req.isAuthenticated()) return resp.status(401).send()
  console.log(req.user._id)

  // UserGoogle
  //   .findOneAndDelete({ _id: req.params.id })
  //   .then(deletedDoc => {
  //     if (deletedDoc) return resp.status(200).send(deletedDoc)
  //     else 
  //       UserLocal
  //       .findOneAndDelete({ _id: req.params.id })
  //       .then(deletedDoc => {
  //         if (!deletedDoc) return resp.status(404).send()
  //         else resp.status(200).json(deletedDoc)
  //       })
  //       .catch(__ => resp.status(404).json())
  //   })
  //   .catch(__ => resp.status(404).json())
})

module.exports = router