const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport')

const router = express.Router();
const Price = require('../models/prices');

const formatPrice = serviceWithPrice => {
  try { return { id: serviceWithPrice._id, name: serviceWithPrice.name, price: serviceWithPrice.price }}
  catch (_) { return null }
}

const formatPrices = prices => prices[0] ? prices.map(formatPrice) : []

router.get('/', (_, resp, __) =>
  Price
    .find()
    .then(result => resp.status(200).json(formatPrices(result)))
    .catch(err => resp.status(400).json(err))
);

router.get('/:id', (req, resp, __) => 
  Price
    .findById(req.params.id)
    .then(result => resp.status(result ? 200 : 404).json(formatPrice(result)))
    .catch(err => resp.status(400).json(err))
);

router.post('/', passport.authenticate('local'), (req, resp, __) => {
  let price = new Price({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  price
    .save()
    .then(result => resp.status(201).json(result))
    .catch(err => resp.status(400).json(err));
});

router.put('/:id', passport.authenticate('local'), (req, resp, _) => {
  let price = new Price({
    _id: req.params.id,
    name: req.body.name,
    price: req.body.price
  });
  
  Price.findOneAndUpdate(
    { _id: req.params.id },
    price,
    { new: true },
    (err, modifiedPrice) => {
      if (err) return resp.status(400).json();
      return resp.status(200).json(modifiedPrice);
    }
  )
})

router.delete('/:id', passport.authenticate('local'), (req, resp, _) => 
  Price
    .findOneAndDelete({ _id: req.params.id })
    .then(deletedDoc => {
      if (!deletedDoc) resp.status(404).send()
      else resp.status(200).send(deletedDoc)
    })
    .catch(err => resp.status(400).json(err))
)

module.exports = router;