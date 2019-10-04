const mongoose = require('mongoose');

const { RetailerSchema } = require('./schema');

const Retailer = mongoose.model('Retailer', RetailerSchema);

module.exports = {
  Retailer
};
