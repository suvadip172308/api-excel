const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const validation = require('../validation/user.validation');
const { User } = require('../models/model.js');
const errorObj = require('../shared/error');

exports.login = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.loginSchema);

  if (error) {
    res.status(400);
    return res.json(errorObj.sendError(400, error.details[0].message));
  }

  let { userName, password } = _.pick(req.body, ['userName', 'password']);
  const user = await User.findOne({ userName });

  if (!user) {
    res.status(400);
    return res.json(errorObj.sendError(400, 'Invalid user name or password'));
  }

  const isValidPasword = await bcrypt.compare(password, user.password);

  if (!isValidPasword) {
    res.status(400);
    return res.json(errorObj.sendError(400, 'Invalid user name or password'));
  }

  return res.status(200).json({
    userName,
    isLoggedIn: true
  });
};
