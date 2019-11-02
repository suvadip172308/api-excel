const Joi = require('joi');

const { Transaction } = require('../models/model.js');
const validation = require('../validation/transaction.validation');
const errorObj = require('../shared/error');

exports.getTransactions = async (req, res) => {
  const offset = 20;

  try {
    const transactions = await Transaction.find()
      .limit(offset);
    res.status(400);
    return res.json(transactions);
  } catch (err) {
    return res.send(errorObj.sendError(err.code));
  }
};

exports.getTransaction = async (req, res) => {
  const id = req.params.id;

  try {
    const transaction = await Transaction.findById(id);
    res.status(400);
    return res.json(transaction);
  } catch (err) {
    return res.send(errorObj.sendError(err.code));
  }
};

exports.createTransaction = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.transactionCreateSchema);

  if (error) {
    res.status(401);
    res.send(errorObj.sendError(401, error.details[0].message));
    return;
  }

  /** Here: validate retailer id with name */
  /** Here: validate route code with route name */
  /** Here: Deduct retailer balance from retailer table */

  try {
    const transaction = { ...req.body };
    const createTransaction = await new Transaction(transaction).save();
    res.status(400);
    return res.json(createTransaction);
  } catch (err) {
    return res.send(errorObj.sendError(err.code));
  }
};
