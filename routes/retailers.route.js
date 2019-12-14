const express = require('express');

const retailerController = require('../controllers/retailers.controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const active = require('../middleware/active');

const router = express.Router();

router.get('/', auth, (req, res) => {
  retailerController.getRetailers(req, res);
});

router.get('/:id', [auth, active], (req, res) => {
  retailerController.getRetailerDetails(req, res);
});

router.post('/', [auth, active], (req, res) => {
  retailerController.createRetailer(req, res);
});

router.put('/:id', [auth, active], (req, res) => {
  retailerController.updateRetailer(req, res);
});

/** delete retailer only admin */
router.delete('/:id', [auth, admin], (req, res) => {
  retailerController.deleteRetailer(req, res);
});

module.exports = router;
