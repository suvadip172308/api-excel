const Joi = require('joi');

exports.retailerSchema = Joi.object().keys({
  retailerName: Joi.string().min(3).max(150).required(),
  companyName: Joi.string().min(3).max(150).required(),
  balance: Joi.number().integer()
});
