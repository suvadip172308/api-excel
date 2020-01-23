const Joi = require('joi');
const _ = require('lodash');

const { Transaction } = require('../models/model.js');
const validation = require('../validation/transaction.validation');
const retailerController = require('./retailers.controller');
const errorObj = require('../shared/error');
const { getDate } = require('../shared/common');

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

exports.getTransactions = async (req, res) => {
  const offset = parseInt(req.query.offset, 10) || 1;
  const pageSize = parseInt(req.query.size, 10) || 10;

  if (offset < 1) {
    return res.status(400).json(errorObj.sendError('Offset should more than 0'));
  }

  if (pageSize > 100) {
    return res.status(400).json(errorObj.sendError('Page size should less than 100'));
  }

  try {
    const transactions = await Transaction.find()
      .skip((offset - 1) * pageSize)
      .limit(pageSize);

    const count = await Transaction.count();

    res.status(200);
    return res.json({
      data: transactions,
      totalElements: count,
      pageSize,
      offset
    });
  } catch (err) {
    return res.json(errorObj.sendError(err.code));
  }
};

exports.findRangeTransaction = async (fromPage, toPage, pageSize) => {
  const size = parseInt(pageSize, 10) || 10;

  const count = await Transaction.count();

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
    const transactions = await Transaction.find()
      .skip((from - 1) * size)
      .limit((to - from) * size);

    return transactions;
  } catch (err) {
    return err;
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

  const transaction = await this.insertTransaction(req.body);

  res.json(transaction);
};

exports.insertTransaction = async (payload) => {
  /** validate retailer id with name */

  const { retailerId } = _.pick(payload, ['retailerId']);
  const retailer = retailerController.getRetailerById(retailerId);

  if (!retailer) {
    return errorObj.sendError(400, 'Not a valid retailer id.');
  }

  /** Implement: validate route code with route name */

  const transaction = { ...payload };

  try {
    const createdTransaction = await new Transaction(transaction).save();
    return createdTransaction;
  } catch (err) {
    return errorObj.sendError(400, 'Transaction is not saved');
  }
};

/** Update Transaction */
exports.updateTransaction = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.transactionUpdateSchema);

  if (error) {
    res.status(401);
    res.json(errorObj.sendError(401, error.details[0].message));
  }

  /** Implement: If update retailerId or name then validate it first */
  /** validate retailer id with name */
  const { retailerId } = _.pick(req.body, ['retailerId']);
  const retailer = retailerController.getRetailerById(retailerId);

  if (!retailer) {
    res.status(400);
    return res.json(errorObj.sendError(400, 'Not a valid retailer id.'));
  }
  /** Implement: If update routeCode validate it first */

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

const doApproveTransaction = async (transactionId) => {
  const item = await Transaction.findOneById(transactionId);

  const retailerId = item.retailerId;
  const retailer = await retailerController.getRetailerById(retailerId);

  if (!retailer) {
    throw new Error('Retailer is not present');
  }

  const balance = retailer.balance + (item.invoiceAmount - item.payment);
  retailerController.modifyRetailer(retailerId, { balance });

  const approvedTransaction = await Transaction.findOneAndUpdate(
    { _id: transactionId },
    { $set: { isApproved: true } },
    { new: true }
  );

  return approvedTransaction;
};

/** approved transaction or transactions (by admin) */
exports.approveTransactions = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.transactionIdsSchema);

  if (error) {
    res.status(401);
    res.json(errorObj.sendError(401, error.details[0].message));
  }

  const transactionIds = req.body.transactionIds || [];

  try {
    let updatedTransaction = [];
    let item = null;

    for (let transactionId of transactionIds) {
      item = await doApproveTransaction(transactionId);
      updatedTransaction.push(item);
    }

    res.status(200);
    return res.json(updatedTransaction);
  } catch (err) {
    return res.json(errorObj.sendError(err.code, 'Transaction approval failed'));
  }
};

/** delete specific transaction */
const deleteTransaction = async (transactionId) => {
  try {
    const detetedTransaction = await Transaction.deleteOne({ _id: transactionId });
    return detetedTransaction;
  } catch (err) {
    throw new Error('Id not found for delete transaction');
  }
};

/** clean all unapproved transaction */
exports.deleteTransactions = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.transactionIdsSchema);

  if (error) {
    res.status(401);
    res.json(errorObj.sendError(401, error.details[0].message));
  }

  const transactionIds = req.body.transactionIds || [];
  let deletedCount = 0;

  try {
    for (let transactionId of transactionIds) {
      let deletedItem = await deleteTransaction(transactionId);
      deletedCount = deletedItem.ok === 1 ? deletedCount + deletedItem.deletedCount : deletedCount;
    }

    res.status(200);
    res.json({ deletedCount });
  } catch (err) {
    res.json(errorObj.sendError(err.code, 'Id not found for delete unapproved transaction'));
  }
};
