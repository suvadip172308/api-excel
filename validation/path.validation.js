const Joi = require('joi');

exports.pathCreateSchema = Joi.object().keys({
  pathId: Joi.string().min(3).max(10).required(),
  pathName: Joi.string().min(3).max(150).required(),
  isActive: Joi.boolean()
});

exports.pathUpdateSchema = Joi.object().keys({
  pathId: Joi.string().min(3).max(10),
  pathName: Joi.string().min(3).max(150),
  isActive: Joi.boolean()
});

exports.pathIdsSchema = Joi.object().keys({
  pathIds: Joi.array().items(Joi.string().min(2).max(100)).min(1).unique()
});
