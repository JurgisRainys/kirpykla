const mongoose = require('mongoose')

const hairdresserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  userId: mongoose.Schema.Types.ObjectId,
  services: [mongoose.Schema.Types.ObjectId],
})

module.exports = mongoose.model('Hairdresser', hairdresserSchema, 'hairdressers')