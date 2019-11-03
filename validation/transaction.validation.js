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

exports.transactionUpdateSchema = Joi.object().keys({
  retailerId: Joi.string().min(2).max(20),
  retailerName: Joi.string().min(3).max(200),
  companyName: Joi.string().min(3).max(200),
  routeCode: Joi.string().min(3).max(20),
  routeName: Joi.string().min(3).max(200),
  agentName: Joi.string().min(3).max(200),
  invoiceId: Joi.string().min(3).max(100),
  invoiceAmount: Joi.number().min(1).precision(2),
  payment: Joi.number().min(1).precision(2),
  operatorName: Joi.string().min(3).max(200)
});
