const mongoose = require('mongoose');

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

module.exports = {
  RetailerSchema
};
