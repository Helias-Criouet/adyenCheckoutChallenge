require('dotenv').config();
const express = require('express');
const router = express.Router();
const client = require('../../lib/adyenClient');
const getLocale = require('../../lib/getLocale');
const getItem = require('../../lib/getItem');

/* POST api/paymentMethods */
router.post('/', async function (req, res) {
  const locale = getLocale(req.body.locale);
  const item = getItem(req.body.itemId);

  try {
    const paymentMethodsResponse = (await client({
      method: 'POST',
      url: 'paymentMethods',
      json: {
        merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
        countryCode: locale.countryCode,
        amount: {
          currency: locale.currency,
          value: item.price * 100,
        },
        channel: 'Web',
        shopperLocale: locale.locale,
        shopperReference: 'theOneSingleShopperOfMyWebsite',
      },
    })).body;

    res.send(paymentMethodsResponse);
  } catch (err) {
    res.status(err.statusCode || 500);
    res.send(err);
  }
});

module.exports = router;
