const mongoose = require('mongoose');

const {
  RetailerSchema,
  UserSchema,
  TransactionSchema,
  PathSchema
} = require('./schema');

const Retailer = mongoose.model('Retailer', RetailerSchema);
const User = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);
const Path = mongoose.model('Path', PathSchema);

module.exports = {
  Retailer,
  User,
  Transaction,
  Path
};
