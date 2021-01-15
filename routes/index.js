const express = require('express');
const router = express.Router();
const getLocale = require('../lib/getLocale');
const items = require('../data/items.json');

/* GET home page */
router.get('/', function(req, res, next) {
  const locale = getLocale(req.query.countryCode);
  res.render(
    'index',
    {
      items,
      currency: locale.currency,
    },
  );
});

module.exports = router;