const { Retailer } = require('../models/model.js');

/** get retailers */
exports.getRetailers = async () => {
  const offset = 20;
  return Retailer.find()
    .limit(offset)
    .select({ _id: 0 });
};


/** create a new retailer */
exports.createRetailer = async (req) => {
  const { retailerName, companyName, balance } = { ...req.body };
  const retailer = {
    retailerName,
    companyName,
    balance
  };

  const newRetailer = new Retailer(retailer);
  return newRetailer.save();
};

/** update retailer */
exports.updateRetailer = async (id, req) => {
  const { companyName, balance } = { ...req.body };
  if (!companyName && !balance) {
    return null;
  }

  let updateObject = {};

  if (companyName) {
    updateObject.companyName = companyName;
  }

  if (balance) {
    updateObject.balance = balance;
  }

  return Retailer.findOneAndUpdate(
    { _id: id },
    { $set: updateObject },
    { new: true }
  );
};

/** delete retailer */
exports.deleteRetailer = async (id) => {
  return Retailer.deleteOne({ _id: id });
};
