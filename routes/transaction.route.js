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

/** Approve transaction or transactions (by admin) */
router.put('/approve', [auth, admin, active], (req, res) => {
  transactionController.approveTransactions(req, res);
});

router.put('/:id', [auth, active], (req, res) => {
  transactionController.updateTransaction(req, res);
});

router.delete('/:id', [auth, admin, active], (req, res) => {
  transactionController.deleteTransaction(req, res);
});

router.delete('/approvals', [auth, admin, active], (req, res) => {
  transactionController.deleteUnapprovedTransaction(req, res);
});

module.exports = router;
