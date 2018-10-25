const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

const router = express.Router();
const Reservation = require('../models/reservation');
const Hairdresser = require('../models/hairdresser');
const Price = require('../models/prices');

const formatReservation = reservation => {
  try { return {
    id: reservation._id,
    hairdresser: reservation.hairdresser,
    service: reservation.service,
    time: reservation.date 
  }}
  catch (_) { return null }
}

const formatReservations = res => res[0] ? res.map(formatReservation) : []

router.get('/', (_, resp, __) =>
  Reservation
    .find()
    .then(result => resp.status(200).json(formatReservations(result)))
    .catch(err => resp.status(400).json(err))
);

router.get('/:id', (req, resp, __) => 
  Reservation
    .findById(req.params.id)
    .then(result => resp.status(result ? 200 : 404).json(formatReservation(result)))
    .catch(err => resp.status(400).json(err))
);

router.post('/', (req, resp, __) => {
  Hairdresser
    .findById(req.body.hairdresser)
    .then(result => {
      if (!result) throw "no hairdresser with such id"
      if (!result.services.map(_ => _.toString()).includes(req.body.service)) 
        throw `hairdresser ${req.body.hairdresser} doesnt provide service ${req.body.service}`
      
      return Price.findById(req.body.service)
    })
    .then(result => {
      if (!result) throw "no service with such id"
      
      const date = moment(req.body.time, "DD-MM-YYYY HH:mm")
      if (!date.isValid()) throw "date not in correct format. Required format: DD-MM-YYYY HH:mm"   

      let reservation = new Reservation({
        _id: new mongoose.Types.ObjectId(),
        hairdresser: req.body.hairdresser,
        service: req.body.service,
        time: date.toDate()
      })

      return reservation.save()
    })
    .then(result => { resp.status(201).json(result) })
    .catch(err => {
      console.log(err)
      resp.status(400).json(err)
    })
});

router.put('/:id', (req, resp, _) => {
  Hairdresser
  .findById(req.body.hairdresser)
  .then(result => {
    if (!result) throw "no hairdresser with such id"
    if (!result.services.map(_ => _.toString()).includes(req.body.service)) 
      throw `hairdresser ${req.body.hairdresser} doesnt provide service ${req.body.service}`
    
    return Price.findById(req.body.service)
  })
  .then(result => {
    if (!result) throw "no service with such id"
    
    const date = moment(req.body.time, "DD-MM-YYYY HH:mm")
    if (!date.isValid()) throw "date not in correct format. Required format: DD-MM-YYYY HH:mm"   
    
    let reservation = new Reservation({
      _id: req.params.id,
      hairdresser: req.body.hairdresser,
      service: req.body.service,
      time: date.toDate()
    });
    
    Reservation.findOneAndUpdate(
      { _id: req.params.id },
      reservation,
      { new: true },
      (err, modified) => {
        if (err) return resp.status(400).json();
        return resp.status(200).json(modified);
      }
    )

    return reservation.save()
  })
  .then(result => { resp.status(201).json(result) })
  .catch(err => {
    console.log(err)
    resp.status(400).json(err)
  })
})

router.delete('/:id', (req, resp, _) => 
  Reservation
    .findOneAndDelete({ _id: req.params.id })
    .then(deletedDoc => {
      if (!deletedDoc) resp.status(404).send()
      else resp.status(200).send(deletedDoc)
    })
    .catch(err => resp.status(400).json(err))
)

module.exports = router;