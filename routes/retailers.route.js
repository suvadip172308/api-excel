const express = require('express');

const retailerController = require('../controllers/retailers.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, (req, res) => {
  retailerController.getRetailers(req, res);
});

router.get('/:id', auth, async (req, res) => {
  retailerController.getRetailerDetails(req, res);
});

router.post('/', auth, async (req, res) => {
  retailerController.createRetailer(req, res);
});

router.put('/:id', auth, async (req, res) => {
  retailerController.updateRetailer(req, res);
});

/** delete retailer */
router.delete('/:id', auth, async (req, res) => {
  retailerController.deleteRetailer(req, res);
});

module.exports = router;
