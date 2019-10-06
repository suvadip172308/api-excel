const { Retailer } = require('../models/model.js');

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

  if (companyName) {
    updateObject.companyName = companyName;
  }

  if (balance) {
    updateObject.balance = balance;
  }

  const updatedRetailer = await Retailer.findOneAndUpdate(
    { _id: id },
    { $set: updateObject },
    { new: true }
  );

  res.send(updatedRetailer);
};

/** delete retailer */
exports.deleteRetailer = async (req, res) => {
  const id = req.params.id;
  const detetedRetailer = await Retailer.deleteOne({ _id: id });

  res.send(detetedRetailer);
};
