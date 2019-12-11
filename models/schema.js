const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const { getDate } = require('../shared/common');

/** Retailer */
/** NB: may be company ubder a retailer is an array */
const RetailerSchema = new mongoose.Schema({
  retailerId: {
    type: String,
    minlength: 2,
    unique: true,
    required: true
  },
  retailerName: {
    type: String,
    required: true,
    minlength: 3
  },
  companyName: {
    type: String,
    required: true,
    minlength: 3
  },
  balance: {
    type: Number,
    default: 0
  },
  isActivated: {
    type: Boolean,
    default: false
  }
});

/** User */
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
    dropDups: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  companies: {
    type: [String],
    required: true,
    minlength: 2,
    maxlength: 200
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({
    _id: this._id,
    isAdmin: this.isAdmin,
    isActive: this.isActive
  }, config.get('jwtKey'));
};

/** Transaction */
const TransactionSchema = new mongoose.Schema({
  retailerId: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true
  },
  retailerName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200
  },
  companyName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200
  },
  routeCode: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  routeName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200
  },
  agentName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200
  },
  invoiceId: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  invoiceAmount: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 10
  },
  payment: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 10
  },
  operatorName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200
  },
  creationDate: {
    type: Date,
    default: getDate()
  },
  updationDate: {
    type: Date,
    default: getDate()
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isUpdated: {
    type: Boolean,
    default: false
  }
});

module.exports = {
  RetailerSchema,
  UserSchema,
  TransactionSchema
};
