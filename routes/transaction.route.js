const express = require('express');

const transactionController = require('../controllers/transaction.controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const active = require('../middleware/active');

const router = express.Router();

router.get('/', [auth, active], (req, res) => {
  transactionController.getTransactions(req, res);
});

router.get('/:id', [auth, active], (req, res) => {
  transactionController.getTransaction(req, res);
});

router.post('/', [auth, active], (req, res) => {
  transactionController.createTransaction(req, res);
});

router.put('/:id', [auth, active], (req, res) => {
  transactionController.updateTransaction(req, res);
});

router.delete('/:id', [auth, admin, active], (req, res) => {
  transactionController.deleteTransaction(req, res);
});

module.exports = router;