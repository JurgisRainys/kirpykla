const mongoose = require('mongoose')
const moment = require('moment')

const reservationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  hairdresser: mongoose.Schema.Types.ObjectId,
  service: mongoose.Schema.Types.ObjectId,
  client: mongoose.Schema.Types.ObjectId,
  time: {
    date: String,
    hour: Number
  }
})

module.exports = mongoose.model('Reservation', reservationSchema, 'reservations')