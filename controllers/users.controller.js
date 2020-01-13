const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const validation = require('../validation/user.validation');
const { User } = require('../models/model.js');
const errorObj = require('../shared/error');

/** User get his details */
exports.findMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(errorObj.sendError(400, 'Not a valid token'));
  }
};

/** create a new user */
exports.createUser = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.createUserSchema);

  if (error) {
    res.status(400);
    return res.json(errorObj.sendError(400, error.details[0].message));
  }

  let {
    userName,
    name,
    companies,
    password
  } = _.pick(req.body, ['userName', 'name', 'password', 'companies']);

  const user = await User.findOne({ userName });

  if (user) {
    res.status(400);
    return res.json(errorObj.sendError(400, 'User already exist'));
  }

  try {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const createdUser = await new User({
      userName,
      name,
      password,
      companies
    }).save();

    return res.json(_.pick(createdUser, ['_id', 'userName', 'name', 'companies', 'isActive']));
  } catch (err) {
    res.status(400);
    return res.json(errorObj.sendError(err.code, 'User can not be created'));
  }
};

/** find user names is available or not */
exports.findUserName = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.findUserSchema);

  if (error) {
    res.status(400);
    return res.json(errorObj.sendError(400, error.details[0].message));
  }

  const { userName } = _.pick(req.body, ['userName']);
  const user = await User.findOne({ userName });

  return res.status(200).json({
    isAvailable: !user
  });
};

/** get all users details (only admin) */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select({
      password: 0
    });

    return res.status(200).json(users);
  } catch (err) {
    res.status(400);
    return res.json(errorObj.sendError(err.code, 'Operation is not permitted'));
  }
};

/** get a user details (only admin) */
exports.getUser = async (req, res) => {
  const id = req.params.id;
  const { error } = Joi.validate({ id }, validation.userIdSchema);

  if (error) {
    return res.status(400)
      .json(errorObj.sendError(400, error.details[0].message));
  }

  try {
    const user = await User.findById(id).select({
      password: 0
    });

    return res.status(200).json(user);
  } catch (err) {
    res.status(400);
    return res.json(errorObj.sendError(err.code, 'Operation is not permitted'));
  }
};

/** activate a new user (only admin) */
exports.changeUserStatus = async (req, res) => {
  const id = req.params.id;
  const isActivate = req.body.isActivate;

  const { error } = Joi.validate({ id, isActivate }, validation.userStatusChangeSchema);

  if (error) {
    return res.status(400)
      .json(errorObj.sendError(400, error.details[0].message));
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: { isActive: isActivate } },
      { new: true }
    ).select('-password');

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400)
      .json(errorObj.sendError(400, 'Invalid id can not be activated'));
  }
};

/** update user */
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { error } = Joi.validate({ id }, validation.userIdSchema);
  const { vError } = Joi.validate(req.body, validation.updateUserSchema);

  if (error) {
    return res.status(400)
      .json(errorObj.sendError(400, error.details[0].message));
  }

  let { name, companies } = _.pick(req.body, ['name', 'companies']);

  if (!name && !companies) {
    return res.status(400).json(errorObj.sendError(400, 'No data to update'));
  }

  if (vError) {
    return res.status(400)
      .json(errorObj.sendError(400, vError.details[0].message));
  }

  let updateUserObject = {};

  if (name) {
    updateUserObject.name = name;
  }

  if (companies && companies.length > 0) {
    updateUserObject.companies = companies;
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: updateUserObject },
      { new: true }
    ).select('-password');

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400)
      .json(errorObj.sendError(400, 'Invalid id can not be activated'));
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const { error } = Joi.validate({ id }, validation.userIdSchema);

  if (error) {
    return res.status(400)
      .json(errorObj.sendError(400, error.details[0].message));
  }

  try {
    const detetedUser = await User.deleteOne({ _id: id });
    res.json(detetedUser);
  } catch (err) {
    res.json(errorObj.sendError(err.code, 'Id not found for delete user'));
  }
};
