const paymentDatabase = {};

/**
 * Generate a random 8-character ID prefixed by the author's initials
 * @returns {string} The randomly generated payment reference
 */
function generatePaymentReference() {
  // Generates a random 8-character ID
  const random = Math.random().toString(36).substr(2, 8);

  return `HC_${random}`;
}

/**
 * Add data related to a payment reference to the database
 * @param {string} paymentReference The payment reference
 * @param {object} paymentData The payment data object
 * @returns {string} The payment reference
 */
function addPayment(paymentReference, paymentData) {
  paymentDatabase[paymentReference] = paymentData;

  return paymentReference;
}

/**
 * Retrieve data related to a payment reference from the database
 * @param {string} paymentReference The payment reference
 * @returns {object} The payment data
 */
function getPayment(paymentReference) {
  return paymentDatabase[paymentReference];
}

module.exports = {
  generatePaymentReference,
  addPayment,
  getPayment,
};
