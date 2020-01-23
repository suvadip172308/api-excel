const Joi = require('joi');

exports.downloadSchema = Joi.object().keys({
  collection: Joi.string().required(),
  toPage: Joi.number().required(),
  fromPage: Joi.number().required(),
  pageSize: Joi.number().required()
});
