const { Retailer } = require('../models/model.js');

/** Get retailers */
exports.getRetailers = async () => {
  const offset = 20;
  return await Retailer.find()
    .limit(offset)
    .select({_id: 0});
};


/** Create a new retailer */
exports.createRetailer = async (retailer) => {
  const lastItem = await Retailer.findOne()
    .sort({_id: -1})
    .limit(1)
    .select(
      {_id: 0, retailerId: 1}
    );

  const lastId = lastItem ? lastItem.retailerId : 1000;

  retailer = {
    ...retailer,
    'retailerId': lastId + 1
  };

  const newRetailer = new Retailer(retailer);
  const result = await newRetailer.save();

  return result;
};