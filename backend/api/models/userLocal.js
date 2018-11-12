var mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  password: String,
  role: String
})

module.exports = mongoose.model('UserLocal', userSchema, 'usersLocal')