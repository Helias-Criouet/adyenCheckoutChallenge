const express = require('express');
const router = express.Router();
const client = require('../lib/adyenClient');
const paymentDatabase = require('../lib/paymentDatabase');

/* GET/POST returnUrl */
router.all('/', async function (req, res) {
  const { paymentReference } = req.query;
  const payment = paymentDatabase.getPayment(paymentReference);

  try {
    const paymentsDetailsResponse = (await client({
      method: 'POST',
      json: {
        details: retrieveActionResult(req),
        paymentData: payment.action.paymentData
      },
      url: 'payments/details',
    })).body;

    res.redirect(`/result?paymentStatus=${paymentsDetailsResponse.resultCode}`);
  } catch (err) {
    // render the error page
    res.status(err.status || 500);
    res.render(
      'error',
      {
        error: err,
        message: err.message,
      }
    );
  }
});

/**
 * Retrieve the action result that is passed either in the query
 * or the body of the request
 * @param {object} req The received request
 * @returns {object} The details object to pass to /payment/details
 */
function retrieveActionResult(req) {
  const resultContainer = req.method === 'GET' ? req.query : req.body;

  if (resultContainer.redirectResult)
    return { redirectResult: decodeURI(resultContainer.redirectResult) };
  if (resultContainer.MD && resultContainer.PaRes)
    return {
      MD: decodeURI(resultContainer.MD),
      PaRes: decodeURI(resultContainer.PaRes)
    };

  throw Error(`Unexpected action result:\n${JSON.stringify(resultContainer)}`);
}

module.exports = router;
