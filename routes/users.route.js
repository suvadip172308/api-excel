const express = require('express');

const userController = require('../controllers/users.controller');

const router = express.Router();

router.post('/', async (req, res) => {
  return userController.createUser(req, res);
});

router.post('/find', async (req, res) => {
  return userController.findUserName(req, res);
});

module.exports = router;
