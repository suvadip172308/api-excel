const Joi = require('joi');

const { Retailer } = require('../models/model.js');
const validation = require('../validation/retailer.validation');

/** get retailers */
exports.getRetailers = async (req, res) => {
  const offset = 20;
  const retailers = await Retailer.find()
    .limit(offset);

  res.send(retailers);
};

/** get a retailer */
exports.getRetailerDetails = async (req, res) => {
  const id = req.params.id;
  
  const retailer = await Retailer.findOne({ _id: id });

  res.send(retailer);
};


/** create a new retailer */
exports.createRetailer = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.retailerSchema);

  if (error) {
    res.statussend(error.details[0].message);
    return;
  }

  const { retailerName, companyName, balance } = { ...req.body };
  const retailer = {
    retailerName,
    companyName,
    balance
  };

  const createdRetailer = await new Retailer(retailer).save();

  res.send(createdRetailer);
};

/** update retailer */
exports.updateRetailer = async (req, res) => {
  const id = req.params.id;
  const { companyName, balance } = { ...req.body };

  if (!companyName && !balance) {
    return;
  }

  let updateObject = {};
  let updatedRetailer;

  if (companyName) {
    updateObject.companyName = companyName;
  }

  if (balance) {
    updateObject.balance = balance;
  }

  try {
    updatedRetailer = await Retailer.findOneAndUpdate(
      { _id: id },
      { $set: updateObject },
      { new: true }
    );
  } catch (err) {
    res.status(422).send(`Not a valid id: ${id}`);
  }

  res.send(updatedRetailer);
};

/** delete retailer */
exports.deleteRetailer = async (req, res) => {
  const id = req.params.id;
  const detetedRetailer = await Retailer.deleteOne({ _id: id });

  res.status(400).send(detetedRetailer);
};
