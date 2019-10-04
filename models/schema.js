const mongoose = require('mongoose');

const RetailerSchema = new mongoose.Schema({
  retailerId: {
    type: Number,
    required: true,
    unique: true,
    dropDups: true
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
    default: 1000
  },
  isActivated: {
    type: Boolean,
    default: false
  }
});

module.exports = {
  RetailerSchema
};
