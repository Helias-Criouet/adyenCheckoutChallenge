require('dotenv').config();
const express = require('express');
const router = express.Router();
const client = require('../../lib/adyenClient');

/* POST api/payments/details */
router.post('/', async function (req, res, next) {
  try {
    const paymentsDetailsResponse = (await client({
      method: 'POST',
      url: 'payments/details',
      json: req.body.stateData,
    })).body;

    if (paymentsDetailsResponse.resultCode == 'Error') console.log(paymentsDetailsResponse.refusalReason);
    
    res.send(paymentsDetailsResponse);
  } catch(err) {
    console.error(err);
    res.status(err.statusCode || 500);
    err.resultCode = 'Error';
    res.send(err);
  }
});

module.exports = router;
