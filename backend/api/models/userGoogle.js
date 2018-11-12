var mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  googleId: String,
  role: String
})

module.exports = mongoose.model('UserGoogle', userSchema, 'usersGoogle')