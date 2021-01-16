require('dotenv').config();
const express = require('express');
const router = express.Router();
const client = require('../../lib/adyenClient');

/* POST api/payments/details */
router.post('/', async function (req, res) {
  try {
    const paymentsDetailsResponse = (await client({
      method: 'POST',
      url: 'payments/details',
      json: req.body.stateData,
    })).body;

    res.send(paymentsDetailsResponse);
  } catch (err) {
    res.status(err.statusCode || 500);
    err.resultCode = 'Error';
    res.send(err);
  }
});

module.exports = router;
