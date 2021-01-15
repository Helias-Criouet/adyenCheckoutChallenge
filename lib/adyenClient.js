require('dotenv').config();
const client = require('got');
const tunnel = require('tunnel');

const prefixUrl = `${process.env.ADYEN_BASEURL}/${process.env.ADYEN_API_VERSION}`;

module.exports = client.extend({
  // agent: {
  //   https: tunnel.httpsOverHttp({
	// 		proxy: {
  //       host: 'localhost',
  //       port: 8888,
	// 		},
	// 	}),
  // },
  responseType: 'json',
  prefixUrl,
  headers: {
    'Content-Type': 'application/json', 
    'x-API-key': process.env.ADYEN_CHECKOUT_API_KEY,
  },
});
