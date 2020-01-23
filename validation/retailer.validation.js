const Joi = require('joi');

exports.retailerUpdateSchema = Joi.object().keys({
  retailerName: Joi.string().min(3).max(150),
  companyName: Joi.string().min(3).max(150),
  balance: Joi.number().integer()
});

exports.retailerSaveSchema = Joi.object().keys({
  retailerId: Joi.string().min(2).max(100).required(),
  retailerName: Joi.string().min(3).max(150).required(),
  companyName: Joi.string().min(3).max(150).required(),
  balance: Joi.number().integer()
});

exports.retailerIdsSchema = Joi.object().keys({
  retailerIds: Joi.array().items(Joi.string().min(2).max(100)).min(1).unique()
});
