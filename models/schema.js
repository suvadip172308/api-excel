const mongoose = require('mongoose');

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
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },
  isActive: {
    type: Boolean,
    default: false
  }
});


module.exports = {
  RetailerSchema,
  UserSchema
};
