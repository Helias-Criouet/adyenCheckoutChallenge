require('dotenv').config();
const express = require('express');
const router = express.Router();
const getItem = require('../lib/getItem');
const getLocale = require('../lib/getLocale');

/* GET checkout */
router.get('/', function(req, res) {
  res.render(
    'checkout',
    {
      clientKey: process.env.ADYEN_CLIENT_KEY,
      item: getItem(req.query.itemId),
      currency: getLocale(req.query.locale).currency
    }
  );
});

module.exports = router;
