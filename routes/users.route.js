const express = require('express');

const auth = require('../middleware/auth');

const userController = require('../controllers/users.controller');

const router = express.Router();

router.post('/', async (req, res) => {
  return userController.createUser(req, res);
});

router.post('/name', async (req, res) => {
  return userController.findUserName(req, res);
});

router.get('/', auth, async (req, res) => {
  return userController.getUser(req, res);
});

module.exports = router;
