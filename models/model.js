const mongoose = require('mongoose');

const { RetailerSchema, UserSchema, TransactionSchema } = require('./schema');

const Retailer = mongoose.model('Retailer', RetailerSchema);
const User = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = {
  Retailer,
  User,
  Transaction
};
