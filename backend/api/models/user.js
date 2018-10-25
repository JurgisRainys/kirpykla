var mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  googleId: String,
  name: String,
  gender: String,
  reservations: [mongoose.Schema.Types.ObjectId ] // list of all reservations
})

module.exports = mongoose.model('User', userSchema, 'users')