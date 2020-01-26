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

/** Activate path by admin */
router.put('/activate', [auth, admin], (req, res) => {
  retailerController.activateRetailers(req, res);
});

router.put('/:id', [auth, active], (req, res) => {
  retailerController.updateRetailer(req, res);
});

/** delete retailer only by admin */
router.delete('/', [auth, admin], (req, res) => {
  retailerController.deleteRetailers(req, res);
});

module.exports = router;
