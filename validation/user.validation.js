const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');

const complexityOptions = {
  min: 5,
  max: 25,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1
};

exports.createUserSchema = Joi.object().keys({
  userName: Joi.string().min(3).max(10).required(),
  name: Joi.string().min(3).max(50).required(),
  password: new PasswordComplexity(complexityOptions).required(),
  companies: Joi.array().items(Joi.string().min(2).max(50)).min(1).max(100)
    .unique()
    .required()
});

exports.updateUserSchema = Joi.object().keys({
  name: Joi.string().min(3).max(100),
  companies: Joi.array().items(Joi.string().min(2).max(100)).min(1).max(10)
    .unique()
});

exports.findUserSchema = Joi.object().keys({
  userName: Joi.string().min(3).max(150).required()
});

exports.loginSchema = Joi.object().keys({
  userName: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(3).max(50).required()
});

exports.userIdSchema = Joi.object().keys({
  id: Joi.string().min(3).max(255).required()
});
