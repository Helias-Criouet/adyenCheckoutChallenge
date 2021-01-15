const express = require('express');
const router = express.Router();

/* GET /result */
router.get('/', function(req, res, next) {
  const paymentStatus = req.query.paymentStatus;
  var message;
  
  switch (paymentStatus) {
    case 'Authorised':
      message = '🎉 Congratulations! The payment was successful.';
      break;
    case 'Pending':
    case 'Received':
      message = '✅ Well done! We successfully received your order, and are waiting for the payment to be completed.';
      break;
    case 'Refused':
      message = '❌ The payment was refused. Please try again using a different payment method or card.';
      break;
    default:
      message = '🛠️ We\'re sorry. Something unexpected happened.';
      break;
  }

  res.render(
    'result',
    {
      paymentStatus,
      message,
    },
  );
});

module.exports = router;