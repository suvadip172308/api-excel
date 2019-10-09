const Joi = require('joi');

const { Retailer } = require('../models/model.js');
const validation = require('../validation/retailer.validation');
const errorObj = require('../shared/error');

/** get retailers */
exports.getRetailers = async (req, res) => {
  const offset = 20;

  try {
    const retailers = await Retailer.find()
      .limit(offset);
    res.json(retailers);
  } catch (err) {
    res.send(errorObj.sendError(err.code));
  }
};

/** get a retailer */
exports.getRetailerDetails = async (req, res) => {
  const id = req.params.id;

  try {
    const retailer = await Retailer.findOne({ retailerId: id });
    res.json(retailer);
  } catch (err) {
    res.send(errorObj.sendError(err.code, 'Id not found'));
  }
};


/** create a new retailer */
exports.createRetailer = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.retailerSaveSchema);

  if (error) {
    res.status(400);
    res.send(errorObj.sendError(400, error.details[0].message));
    return;
  }

  const {
    retailerId, retailerName, companyName, balance
  } = { ...req.body };

  const retailer = {
    retailerId,
    retailerName,
    companyName,
    balance
  };

  try {
    const createdRetailer = await new Retailer(retailer).save();
    res.json(createdRetailer);
  } catch (err) {
    res.status(403);
    res.json(errorObj.sendError(err.code));
  }
};

/** update retailer */
exports.updateRetailer = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.retailerUpdateSchema);

  if (error) {
    res.status(400);
    res.json(errorObj.sendError(400, error.details[0].message));
    return;
  }

  const { retailerName, companyName, balance } = { ...req.body };

  if (!retailerName
    && !companyName
    && !balance
  ) {
    res.json(errorObj.sendError(403));
    return;
  }

  let updateObject = {};
  const id = req.params.id;

  if (retailerName) {
    updateObject.retailerName = retailerName;
  }

  if (companyName) {
    updateObject.companyName = companyName;
  }

  if (balance) {
    updateObject.balance = balance;
  }

  try {
    const updatedRetailer = await Retailer.findOneAndUpdate(
      { retailerId: id },
      { $set: updateObject },
      { new: true }
    );
    res.json(updatedRetailer);
  } catch (err) {
    res.json(errorObj.sendError(err.code, 'Id not found'));
  }
};

/** delete retailer */
exports.deleteRetailer = async (req, res) => {
  const id = req.params.id;
  try {
    const detetedRetailer = await Retailer.deleteOne({ retailerId: id });
    res.json(detetedRetailer);
  } catch (err) {
    res.json(errorObj.sendError(err.code, 'Id not found'));
  }
};
