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
  userName: Joi.string().min(3).max(50).required(),
  password: new PasswordComplexity(complexityOptions).required()
});

exports.findUserSchema = Joi.object().keys({
  userName: Joi.string().min(3).max(150).required()
});

exports.loginSchema = Joi.object().keys({
  userName: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(3).max(50).required()
});
