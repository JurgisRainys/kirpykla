const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

const router = express.Router();
const Reservation = require('../models/reservation');
const Hairdresser = require('../models/hairdresser');
const Price = require('../models/prices');
const helpers = require('./helpers')

const formatReservation = reservation => {
  try { return {
    id: reservation._id,
    hairdresser: reservation.hairdresser,
    service: reservation.service,
    time: reservation.time 
  }}
  catch (_) { return null }
}

const formatReservations = res => res[0] ? res.map(formatReservation) : []

const dateFromNowWithDaysAdded = (days) => {
  var result = new Date();
  result.setDate(result.getDate() + days);
  return result;
}

const arrayRange = (length) => Array.from(new Array(length).keys()).map(_ => _ + 1)

const nextWeekWorkitimes = () => {
  const possibleDays = 
    arrayRange(7)
    .map(days => {
      const date = dateFromNowWithDaysAdded(days)
      return date.toJSON().split('T')[0].split('-').reverse().join('-');
    })

  const possibleHours = arrayRange(5).map(_ => _ + 7).concat(arrayRange(4).map(_ => _ + 13))
  return possibleDays.map(date => 
    possibleHours.map(hour => ({ date, hour }))
  ).reduce((acc, val) => acc.concat(val))
}

router.get('/', helpers.checkAuth, (req, resp, __) => {
  Reservation
    .aggregate([
      { $match: { client: mongoose.Types.ObjectId(req.user._id) } },
      { 
          $lookup:
          {
            from: 'hairdressers',
            localField: 'hairdresser',
            foreignField: '_id',
            as: 'hairdresser'
          }
       },
       { 
        $lookup:
          {
            from: 'prices',
            localField: 'service',
            foreignField: '_id',
            as: 'service'
          }
        },
       {
          $project: {
            time: "$time",
            hairdresser: { $arrayElemAt: ["$hairdresser.name", 0] },
            service: { $arrayElemAt: ["$service.name", 0] },
            price: { $arrayElemAt: ["$service.price", 0] },
            client: "$client",
            _id: "$_id"
          }
       }
    ])
    .then(result => {
      resp.status(200).json(result)
    })
    .catch(err => resp.status(400).json(err))
});

router.get('/hairdresser', helpers.checkHairdresser, (req, resp, __) => {
  // console.log(req.user)
  Hairdresser.findOne({ userId: mongoose.Types.ObjectId(req.user._id) })
  .then(result => {
    console.log(result._id)
    return Reservation
      .aggregate([
        { $match: { hairdresser: mongoose.Types.ObjectId(result._id) } },
        // { 
        //     $lookup:
        //     {
        //       from: 'hairdressers',
        //       localField: '_id',
        //       foreignField: 'userId',
        //       as: 'hairdresser'
        //     }
        // },
        {
          $lookup:
          {
            from: 'usersLocal',
            localField: 'client',
            foreignField: '_id',
            as: 'client'
          }
        },
        {
          $lookup:
          {
            from: 'prices',
            localField: 'service',
            foreignField: '_id',
            as: 'service'
          }
        },
        {
          $project: {
            time: "$time",
            client: { $arrayElemAt: ["$client.name", 0] },
            service: { $arrayElemAt: ["$service.name", 0] },
            price: { $arrayElemAt: ["$service.price", 0] },
            _id: "$_id"
          }
        }
      ])
  }).then(result => {
    console.log(result)
    resp.status(200).json(result)
  })
  .catch(err => resp.status(400).json(err))

  //
    // .then(result => {
    //   console.log(result)
    //   resp.status(200).json(result)
    // })
    // .catch(err => resp.status(400).json(err))
});

router.get('/freetimes/hairdresser/:hId/service/:sId', helpers.checkAuth, (_, resp, __) => {
  Reservation
    .find()
    .then(result => { 
      const x = nextWeekWorkitimes().filter(r => 
        result.filter(occupied => 
          occupied.time.date === r.date && 
          occupied.time.hour === r.hour
        ).length === 0
      )
      resp.status(200).json(x)
    })
    .catch(err => {
      console.log(err)
      resp.status(400).json(err)
    })
});

router.get('/:id', helpers.checkAuth, (req, resp, __) => 
  Reservation
    .findById(req.params.id)
    .then(result => resp.status(result ? 200 : 404).json(formatReservation(result)))
    .catch(err => resp.status(400).json(err))
);

router.post('/', helpers.checkAuth, (req, resp, __) => {
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
      
      // const date = moment(req.body.time, "DD-MM-YYYY HH:mm")
      // if (!date.isValid()) throw "date not in correct format. Required format: DD-MM-YYYY HH:mm"   

      let reservation = new Reservation({
        _id: new mongoose.Types.ObjectId(),
        hairdresser: req.body.hairdresser,
        service: req.body.service,
        client: req.user._id,
        time: req.body.time
      })
      console.log(reservation)
      return reservation.save()
    })
    .then(result => { resp.status(201).json(result) })
    .catch(err => {
      console.log(err)
      resp.status(400).json(err)
    })
});

router.put('/:id', helpers.checkAdmin, (req, resp, _) => {
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

router.delete('/:id', helpers.checkAuth, (req, resp, _) => 
  Reservation
    .findOneAndDelete({ _id: req.params.id, client: req.user._id })
    .then(deletedDoc => {
      if (!deletedDoc) resp.status(404).send()
      else resp.status(200).send(deletedDoc)
    })
    .catch(err => resp.status(400).json(err))
)

module.exports = router;