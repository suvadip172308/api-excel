const Joi = require('joi');
const _ = require('lodash');

const { Transaction } = require('../models/model.js');
const validation = require('../validation/transaction.validation');
const retailerController = require('./retailers.controller');
const errorObj = require('../shared/error');
const { getDate } = require('../shared/common');

exports.getTransactions = async (req, res) => {
  const offset = 20;

  try {
    const transactions = await Transaction.find()
      .limit(offset);
    res.status(200);
    return res.json(transactions);
  } catch (err) {
    return res.json(errorObj.sendError(err.code));
  }
};

exports.getTransaction = async (req, res) => {
  const id = req.params.id;

  try {
    const transaction = await Transaction.findById(id);
    res.status(200);
    return res.json(transaction);
  } catch (err) {
    return res.send(errorObj.sendError(err.code));
  }
};

/** Create a New Transaction */
exports.createTransaction = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.transactionCreateSchema);

  if (error) {
    res.status(401);
    res.json(errorObj.sendError(401, error.details[0].message));
    return;
  }

  /** validate retailer id with name */
  const { retailerId } = _.pick(req.body, ['retailerId']);
  const retailer = retailerController.getRetailerById(retailerId);

  if (!retailer) {
    res.status(400);
    return res.json(errorObj.sendError(400, 'Not a valid retailer id.'));
  }
  /** Implement: validate route code with route name */

  try {
    const transaction = { ...req.body };
    const createTransaction = await new Transaction(transaction).save();
    res.status(200);
    return res.json(createTransaction);
  } catch (err) {
    console.log('Error :', err);
    return res.json(errorObj.sendError(400, 'Transaction is not saved'));
  }
};

/** Update Transaction */
exports.updateTransaction = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.transactionUpdateSchema);

  if (error) {
    res.status(401);
    res.json(errorObj.sendError(401, error.details[0].message));
  }

  const id = req.params.id;
  const updatedTransaction = getUpdationObject(req.body);

  try {
    const modifiedTransaction = await Transaction.findOneAndUpdate(
      { _id: id },
      { $set: updatedTransaction },
      { new: true }
    );

    return res.status(200).json(modifiedTransaction);
  } catch (err) {
    res.status(400);
    return res.json(errorObj.sendError(err.code, 'Invalid Id'));
  }
};

function getUpdationObject(payload) {
  const {
    retailerId,
    retailerName,
    companyName,
    routeCode,
    routeName,
    agentName,
    invoiceId,
    invoiceAmount,
    payment,
    operatorName
  } = { ...payload };

  let updationObject = {};

  if (retailerId) {
    updationObject.retailerId = retailerId;
  }

  if (retailerName) {
    updationObject.retailerName = retailerName;
  }

  if (companyName) {
    updationObject.companyName = companyName;
  }

  if (routeCode) {
    updationObject.routeCode = routeCode;
  }

  if (routeName) {
    updationObject.routeName = routeName;
  }

  if (agentName) {
    updationObject.agentName = agentName;
  }

  if (invoiceId) {
    updationObject.invoiceId = invoiceId;
  }

  if (invoiceAmount) {
    updationObject.invoiceAmount = invoiceAmount;
  }

  if (payment) {
    updationObject.payment = payment;
  }

  if (operatorName) {
    updationObject.operatorName = operatorName;
  }

  return {
    ...updationObject,
    isApproved: false,
    updationDate: getDate(),
    isUpdated: true
  };
}
