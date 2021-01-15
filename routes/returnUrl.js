const express = require('express');
const router = express.Router();
const client = require('../lib/adyenClient');
const paymentDatabase = require('../lib/paymentDatabase');

/* GET/POST returnUrl */
router.all('/', async function (req, res, next) {
  const paymentReference = req.query.paymentReference;
  const payment = paymentDatabase.getPayment(paymentReference);

  try {
    const paymentsDetailsResponse = (await client({
      method: 'POST',
      url: 'payments/details',
      json: {
        details: retrieveActionResult(req),
        paymentData: payment.action.paymentData,
      },
    })).body;

    if (paymentsDetailsResponse.resultCode == 'Error') console.log(paymentsDetailsResponse.refusalReason);
    
    res.redirect(`/result?paymentStatus=${paymentsDetailsResponse.resultCode}`);
  } catch(err) {
    // render the error page
    res.status(err.status || 500);
    res.render(
      'error',
      {
        message: err.message,
        error: err,
      }
    );
  }
});

function retrieveActionResult(req) {
  const resultContainer = req.method === 'GET' ? req.query : req.body;

  if (resultContainer.redirectResult)
    return { redirectResult: decodeURI(resultContainer.redirectResult) };
  if (resultContainer.MD && resultContainer.PaRes)
    return {
      MD: decodeURI(resultContainer.MD),
      PaRes: decodeURI(resultContainer.PaRes),
    };

  throw Error(`Unexpected action result:\n${JSON.stringify(resultContainer)}`);
}

module.exports = router;
