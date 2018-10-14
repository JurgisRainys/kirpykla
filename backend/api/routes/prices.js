const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Price = require('../schemas/prices');

const formatPrice = serviceWithPrice => {
  try { return { id: serviceWithPrice._id, name: serviceWithPrice.name, price: serviceWithPrice.price }}
  catch (_) { return null }
}

const formatPrices = prices => {
  if (!formatPrice(prices[0])) return [];
  return prices.map(x => { return { id: x._id, name: x.name, price: x.price }})
}

router.get('/', (_, resp, __) =>
  Price
    .find()
    .then(result => resp.status(200).json(formatPrices(result)))
    .catch(err => resp.status(400).send())
);

router.get('/:id', (req, resp, __) => 
  Price
    .findById(req.params.id)
    .then(result => resp.status(200).json(formatPrice(result)))
    .catch(err => resp.status(400).send())
);

router.post('/', (req, resp, __) => {
  let price = new Price({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  price
    .save()
    .then(result => resp.status(201).json(result))
    .catch(_ => resp.status(400).json());
});

router.put('/:id', (req, resp, _) => {
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
      if (err) return resp.status(400).send();
      return resp.status(200).send(modifiedPrice);
    }
  )
})

router.delete('/:id', (req, resp, _) => 
  Price
    .findOneAndDelete({ _id: req.params.id })
    .then(deletedDoc => {
      if (!deletedDoc) resp.status(404).send()
      else resp.status(200).send(deletedDoc)
    })
    .catch(__ => resp.status(404).json())
)

module.exports = router;