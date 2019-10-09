const mongoose = require('mongoose');

const { RetailerSchema, UserSchema } = require('./schema');

const Retailer = mongoose.model('Retailer', RetailerSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {
  Retailer,
  User
};
