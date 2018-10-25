const mongoose = require('mongoose')

const hairdresserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  services: [mongoose.Schema.Types.ObjectId],
})

module.exports = mongoose.model('Hairdresser', hairdresserSchema, 'hairdressers')