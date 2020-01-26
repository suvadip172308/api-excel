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

exports.findRangeRetailer = async (fromPage, toPage, pageSize) => {
  const size = parseInt(pageSize, 10) || 10;

  const count = await Retailer.count();

  const totalPage = Math.ceil(count / size);

  const from = parseInt(fromPage, 10) || 1;
  const to = parseInt(toPage, 10) || totalPage;

  if (from < 1) {
    new Error('fromPage should greater than 0');
  }

  if (size > 0) {
    new Error('pageSize should greater than 0');
  }

  if (to > count) {
    new Error(`toPage should less or equal than ${totalPage}`);
  }

  if (to < from) {
    new Error('toPage should be greater or equal to fromPage');
  }

  try {
    const retailers = await Retailer.find()
      .skip((from - 1) * size)
      .limit((to - from) * size);

    return retailers;
  } catch (err) {
    return err;
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

  const retailer = await this.insertRetailer(req.body);

  res.json(retailer);
};

exports.insertRetailer = async (payload) => {
  const {
    retailerId, retailerName, companyName, balance
  } = { ...payload };

  const retailer = {
    retailerId,
    retailerName,
    companyName,
    balance
  };

  try {
    const createdRetailer = await new Retailer(retailer).save();
    return createdRetailer;
  } catch (err) {
    return errorObj.sendError(err.code);
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

const activateRetailer = async (retailerId) => {
  try {
    const activatedItem = await Retailer.findOneAndUpdate(
      { retailerId },
      { $set: { isActivated: true } },
      { new: true }
    );
    return activatedItem;
  } catch (err) {
    throw new Error('Path Id does not exist');
  }
};

/** Activate retailers (by admin) */
exports.activateRetailers = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.retailerIdsSchema);

  if (error) {
    res.status(401);
    res.json(errorObj.sendError(401, error.details[0].message));
  }

  const retailerIds = req.body.retailerIds;
  let activatedRetailers = [];

  try {
    for (let retailerId of retailerIds) {
      const activatedRetailer = await activateRetailer(retailerId);
      activatedRetailers.push(activatedRetailer);
    }

    res.json({ activatedRetailers });
  } catch (err) {
    res.json(errorObj.sendError(err.code, 'Id not found'));
  }
};

/** delete retailers */
const deleteRetailer = async (retailerId) => {
  try {
    const deletedItem = await Retailer.deleteOne({ retailerId });
    return deletedItem;
  } catch (err) {
    throw new Error('Retailer Id is not exist');
  }
};

exports.deleteRetailers = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.retailerIdsSchema);

  if (error) {
    res.status(401);
    res.json(errorObj.sendError(401, error.details[0].message));
  }

  const retailerIds = req.body.retailerIds;
  let deleteCount = 0;

  try {
    for (let retailerId of retailerIds) {
      const deletedItem = await deleteRetailer(retailerId);

      deleteCount = deletedItem.ok === 1
        ? deleteCount + deletedItem.deletedCount
        : deleteCount;
    }

    res.json({ deletedCount: deleteCount });
  } catch (err) {
    res.json(errorObj.sendError(err.code, 'Id not found'));
  }
};
