const express = require('express');
const Joi = require('joi');

const { Retailer } = require('../models/model.js');
const retailerController = require('../controllers/retailers');

const router = express.Router();

/**GET Courses */
router.get('/', async (req, res) => {
  const retailers = await retailerController.getRetailers();
  
  res.send(retailers);
});

/** POST Course */
router.post('/', async (req, res) => {
  const { retailerName, companyName, balance } = { ...req.body };
  const retailer = {
    retailerName,
    companyName,
    balance
  };

  const createdRetailer = await retailerController.createRetailer(retailer);
  res.send(createdRetailer);
});


module.exports = router;