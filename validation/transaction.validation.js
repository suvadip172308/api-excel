const Joi = require('joi');

exports.transactionCreateSchema = Joi.object().keys({
  retailerId: Joi.string().min(2).max(20).required(),
  retailerName: Joi.string().min(3).max(200).required(),
  companyName: Joi.string().min(3).max(200).required(),
  routeCode: Joi.string().min(3).max(20).required(),
  routeName: Joi.string().min(3).max(200).required(),
  agentName: Joi.string().min(3).max(200).required(),
  invoiceId: Joi.string().min(3).max(100).required(),
  invoiceAmount: Joi.number().min(1).precision(2)
    .required(),
  payment: Joi.number().min(1).precision(2)
    .required(),
  operatorName: Joi.string().min(3).max(200).required()
});
