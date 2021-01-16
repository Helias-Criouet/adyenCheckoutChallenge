/*
 * A few good ideas (e.g. the 'filterUnimplemented' method) come from
 * https://github.com/adyen-examples/adyen-node-online-payments
 */

const clientKey = document.getElementById('client-key').innerHTML;
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemId');
const locale = urlParams.get('locale');

/**
 * Setup the Adyen drop-in component
 * @returns {undefined} N/A
 */
async function setupDropin() {
  try {
    const paymentMethodsResponse = await callServer(
      'api/paymentMethods',
      {
        itemId,
        locale
      }
    );

    const dropinConfig = {
      paymentMethodsResponse: filterUnimplemented(paymentMethodsResponse),
      paymentMethodsConfiguration: {
        card: {
          hasHolderName: true,
          holderNameRequired: true,
          enableStoreDetails: true,
          name: 'Credit or debit card',
          billingAddressRequired: true
        }
      },
      clientKey,
      locale: 'en_US',
      environment: 'test',
      onSubmit: (state, dropin) => {
        if (state.isValid) {
          handleSubmission(state, dropin, '/api/payments');
        }
      },
      onAdditionalDetails: (state, dropin) => {
        handleSubmission(state, dropin, '/api/payments/details');
      }
    };

    // eslint-disable-next-line no-undef
    const checkout = new AdyenCheckout(dropinConfig);

    checkout.create('dropin').mount('#dropin-container');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

/**
 * Filter out the unimplemented payment methods
 * @param {object} pm The unfiltered response from the payment methods call
 * @returns {object} The filtered payment methods object
 */
function filterUnimplemented(pm) {
  pm.paymentMethods = pm.paymentMethods.filter((it) => [
    'scheme',
    'ideal',
    'wechatpayWeb'
    // "poli",
    // "dotpay",
    // "giropay",
    // "sepadirectdebit",
    // "directEbanking",
    // "ach",
    // "alipay",
    // "klarna_paynow",
    // "klarna",
    // "klarna_account",
    // "boletobancario_santander",
  ].includes(it.type));

return pm;
}

/**
 * Perform necessary actions when the shopper submits the form successfully
 * @param {object} state The state of the drop-in
 * @param {object} dropin The drop-in
 * @param {string} url The API URL to call
 * @returns {undefined} N/A
 */
async function handleSubmission(state, dropin, url) {
  try {
    const response = await callServer(
      url,
      {
        itemId,
        locale,
        stateData: state.data
      }
    );

    if (response.action) {
      dropin.handleAction(response.action);
    } else
      window.location.href = `/result?paymentStatus=${response.resultCode}`;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

/**
 * Call the server with the relevant data on the relevant route
 * @param {string} url The API URL to call
 * @param {object} data The data to send
 * @returns {object} The response from the server
 */
async function callServer(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : '',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return response.json();
}

setupDropin();
