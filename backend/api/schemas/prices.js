var mongoose = require('mongoose')

const priceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number
})

module.exports = mongoose.model('Price', priceSchema, 'prices')