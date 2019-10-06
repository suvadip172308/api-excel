const express = require('express');
const Joi = require('joi');

const retailerController = require('../controllers/retailers');

const router = express.Router();

/** get courses */
router.get('/', async (req, res) => {
  const retailers = await retailerController.getRetailers();

  res.send(retailers);
});

/** create course */
router.post('/', async (req, res) => {
  const createdRetailer = await retailerController.createRetailer(req);
  res.send(createdRetailer);
});

/** update  course */
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const updatedRetailer = await retailerController.updateRetailer(id, req);

  res.send(updatedRetailer);
});

/** delete course */
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const detetedRetailer = await retailerController.deleteRetailer(id);

  res.send(detetedRetailer);
});

module.exports = router;
