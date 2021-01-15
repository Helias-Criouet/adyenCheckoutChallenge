const paymentDatabase = {};

function generatePaymentReference() {
  // Generates a random 8-character ID
  const random = Math.random().toString(36).substr(2, 8);
  return `HC_${random}`;
}

function addPayment(paymentReference, paymentData) {
  paymentDatabase[paymentReference] = paymentData;
  return paymentReference;
}

function getPayment(paymentReference) {
  return paymentDatabase[paymentReference];
}

module.exports = {
  generatePaymentReference,
  addPayment,
  getPayment,
};