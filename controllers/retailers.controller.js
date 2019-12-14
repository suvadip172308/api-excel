const Joi = require('joi');

const { Retailer } = require('../models/model.js');
const validation = require('../validation/retailer.validation');
const errorObj = require('../shared/error');

/** get retailers */
exports.getRetailers = async (req, res) => {
  const offset = parseInt(req.query.offset, 10) || 1;
  const pageSize = parseInt(req.query.size, 10) || 10;

  if (offset < 1) {
    return res.status(400).json(errorObj.sendError('Offset should more than 0'));
  }

  if (pageSize > 100) {
    return res.status(400).json(errorObj.sendError('Page size should less than 100'));
  }

  try {
    const retailers = await Retailer.find()
      .skip((offset - 1) * pageSize)
      .limit(pageSize);

    const count = await Retailer.count();

    res.status(200);
    return res.json({
      data: retailers,
      totalElements: count,
      pageSize,
      offset
    });
  } catch (err) {
    res.send(errorObj.sendError(err.code));
  }
};

/** get a retailer */
exports.getRetailerDetails = async (req, res) => {
  const id = req.params.id;

  try {
    const retailer = await this.getRetailerById(id);
    res.status(200);
    res.json(retailer);
  } catch (err) {
    res.send(errorObj.sendError(err.code, 'Id not found'));
  }
};

exports.getRetailerById = async (id) => {
  const retailer = await Retailer.findOne({ retailerId: id });
  return retailer;
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

  try {
    const id = req.params.id;
    const updatedRetailer = await this.modifyRetailer(id, req.body);
    return res.status(200).json(updatedRetailer);
  } catch (err) {
    return res.json(errorObj.sendError(err.code, 'Id not found'));
  }
};

exports.modifyRetailer = async (id, payload) => {
  const { retailerName, companyName, balance } = { ...payload };

  let updateObject = {};

  if (retailerName) {
    updateObject.retailerName = retailerName;
  }

  if (companyName) {
    updateObject.companyName = companyName;
  }

  if (balance) {
    updateObject.balance = balance;
  }

  const updatedRetailer = await Retailer.findOneAndUpdate(
    { retailerId: id },
    { $set: updateObject },
    { new: true }
  );

  return updatedRetailer;
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
