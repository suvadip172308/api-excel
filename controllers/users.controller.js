const Joi = require('joi');
const _ = require('lodash');

const validation = require('../validation/user.validation');
const { User } = require('../models/model.js');
const errorObj = require('../shared/error');

exports.createUser = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.createUserSchema);

  if (error) {
    res.status(400);
    return res.json(errorObj.sendError(400, error.details[0].message));
  }

  const { userName, password } = _.pick(req.body, ['userName', 'password']);
  const user = await User.findOne({ userName });

  if (user) {
    res.status(400);
    return res.json(errorObj.sendError(400, 'User already exist'));
  }

  try {
    const createdUser = await new User({ userName, password }).save();
    return res.json(_.pick(createdUser, ['_id', 'userName']));
  } catch (err) {
    res.status(400);
    return res.json(errorObj(err.code, 'User can not be created'));
  }
};

exports.findUserName = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.findUserSchema);

  if (error) {
    res.status(400);
    return res.json(errorObj.sendError(400, error.details[0].message));
  }

  const { userName } = _.pick(req.body, ['userName']);
  const user = await User.findOne({ userName });

  res.status(200).json({
    userName,
    isValid: !!user
  });
};
