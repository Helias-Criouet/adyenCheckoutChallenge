const items = require('../data/items');

module.exports = (id) => items.find((item) => item.id === id) || items[0];
