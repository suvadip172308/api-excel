const express = require('express');

const retailerController = require('../controllers/retailers');

const router = express.Router();

router.get('/', (req, res) => {
  retailerController.getRetailers(req, res);
});

router.get('/:id', async (req, res) => {
  retailerController.getRetailerDetails(req, res);
});

router.post('/', async (req, res) => {
  retailerController.createRetailer(req, res);
});

router.put('/:id', async (req, res) => {
  retailerController.updateRetailer(req, res);
});

/** delete retailer */
router.delete('/:id', async (req, res) => {
  retailerController.deleteRetailer(req, res);
});

module.exports = router;
