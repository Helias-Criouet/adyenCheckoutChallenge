require('dotenv').config();
const locales = require('../data/locales');

module.exports =
  (locale) => locales[locale] || locales[process.env.DEFAULT_LOCALE];
