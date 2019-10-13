const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

/** Retailer */
const RetailerSchema = new mongoose.Schema({
  retailerId: {
    type: String,
    minlength: 2,
    unique: true,
    dropDups: true,
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


module.exports = {
  RetailerSchema,
  UserSchema
};
