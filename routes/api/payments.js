require('dotenv').config();
const express = require('express');
const router = express.Router();
const client = require('../../lib/adyenClient');
const getLocale = require('../../lib/getLocale');
const getItem = require('../../lib/getItem');
const paymentDatabase = require('../../lib/paymentDatabase');

/* POST api/payments */
router.post('/', async function (req, res) {
  const locale = getLocale(req.body.locale);
  const item = getItem(req.body.itemId);
  const { stateData } = req.body;
  const reference = paymentDatabase.generatePaymentReference();
  const useToken = stateData.paymentMethod.type === 'scheme' &&
    !stateData.storePaymentMethod;

  try {
    const paymentsResponse = (await client({
      method: 'POST',
      url: 'payments',
      json: {
        reference,
        amount: {
          currency: locale.currency,
          value: item.price * 100,
        },
        additionalData: { allow3DS2: true,
          executeThreeD: true, },
        countryCode: locale.countryCode,
        shopperLocale: locale.locale,
        shopperReference: 'theOneSingleShopperOfMyWebsite',
        storePaymentMethod: stateData.storePaymentMethod,
        // shopperInteraction: useToken ? 'ContAuth' : '',
        recurringProcessingModel: useToken ? 'CardOnFile' : '',
        shopperIP: req.ip,
        shopperEmail: 's.hopper@example.com',
        origin: process.env.ORIGIN,
        channel: 'Web',
        browserInfo: stateData.browserInfo,
        billingAddress: stateData.billingAddress,
        paymentMethod: stateData.paymentMethod,
        returnUrl:
          `${process.env.ORIGIN}/returnUrl?paymentReference=${reference}`,
        merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
      },
    })).body;

    // Add payment info to database
    // for e.g. further payment actions or reconciliation tasks
    paymentDatabase.addPayment(reference, paymentsResponse);
    res.send(paymentsResponse);
  } catch (err) {
    res.status(err.statusCode || 500);
    err.resultCode = 'Error';
    res.send(err);
  }
});

module.exports = router;
