// A few good ideas (e.g. the 'filterUnimplemented' method)
// come from https://github.com/adyen-examples/adyen-node-online-payments/blob/0090e23b86e2f2ebbb9ac7b7fc90895599f1e889/public/adyenImplementation.js

const dropinContainer = document.getElementById('dropin-container').innerHTML;
const clientKey = document.getElementById('client-key').innerHTML;
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemId');
const locale = urlParams.get('locale');

async function setupDropin() {
  try {
    const paymentMethodsResponse = await callServer(
      'api/paymentMethods',
      {
        itemId,
        locale,
      },
    );

    const dropinConfig = {
      paymentMethodsResponse: filterUnimplemented(paymentMethodsResponse),
      paymentMethodsConfiguration: {
        card: {
          hasHolderName: true,
          holderNameRequired: true,
          enableStoreDetails: true,
          name: 'Credit or debit card',
          billingAddressRequired: true,
        },
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
      },
    };

    const checkout = new AdyenCheckout(dropinConfig);
    checkout.create('dropin').mount('#dropin-container');
  } catch (err) {
    console.error(err);
  }
}

function filterUnimplemented(pm) {
  pm.paymentMethods = pm.paymentMethods.filter((it) =>
    [
      "scheme",
      "ideal",
      "wechatpayWeb",
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
    ].includes(it.type)
  );
  return pm;
}

async function handleSubmission(state, dropin, url) {
  try {
    const response = await callServer(
      url,
      {
        itemId,
        locale,
        stateData: state.data,
      }
    );
    
    if (response.action) {
      dropin.handleAction(response.action);
    } else window.location.href = `/result?paymentStatus=${response.resultCode}`;
  } catch (err) {
    console.error(err);
  }
}

async function callServer(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : '',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

setupDropin();