# Adyen Checkout Challenge

A website able to perform credit card and iDEAL payments on the Adyen test environment thanks to the [Web Drop-in integration](https://docs.adyen.com/online-payments/drop-in-web).

## Getting Started

### Dependencies

* Node.js LTS version
* npm

### Installing

You will need to create a `.env` file in the root folder and provide your Adyen checkout API key, client key and merchant account. You can use the `.env.example` file as an example.

Then, run the following command to finish the setup:

```bash
npm install
```

### Executing program

```bash
npm start
```

The server will run on `http://localhost:3000` by default.
