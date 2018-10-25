const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Hairdresser = require('../models/hairdresser');

const formatHairdresser = hairdresser => {
  try { return { id: hairdresser._id, name: hairdresser.name, services: hairdresser.services }}
  catch (_) { return null }
}

const formatHairdressers = hairdressers => hairdressers[0] ? hairdressers.map(formatHairdresser) : []

router.get('/', (_, resp, __) =>
  Hairdresser
    .find()
    .then(result =>       
      resp.status(200).json(formatHairdressers(result))
    )
    .catch(err => resp.status(400).json(err))
);

router.get('/:id', (req, resp, __) => 
  Hairdresser
    .findById(req.params.id)
    .then(result => 
      resp.status(result ? 200 : 404).json(formatHairdresser(result))
    )
    .catch(err => resp.status(400).json(err))
);

router.post('/', (req, resp, __) => {
  let hairdresser = new Hairdresser({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    services: req.body.services
  });

  hairdresser
    .save()
    .then(result => resp.status(201).json(result))
    .catch(err => resp.status(400).json(err));
});

router.put('/:id', (req, resp, _) => {
  let hairdresser = new Hairdresser({
    _id: req.params.id,
    name: req.body.name,
    services: req.body.services
  });
  
  Hairdresser.findOneAndUpdate(
    { _id: req.params.id },
    hairdresser,
    { new: true },
    (err, modified) => {
      if (err) return resp.status(400).json();
      return resp.status(200).json(modified);
    }
  )
})

router.delete('/:id', (req, resp, _) => 
  Hairdresser
    .findOneAndDelete({ _id: req.params.id })
    .then(deletedDoc => {
      if (!deletedDoc) resp.status(404).send()
      else resp.status(200).send(deletedDoc)
    })
    .catch(__ => resp.status(404).json())
)

module.exports = router;