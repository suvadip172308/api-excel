const express = require('express');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const active = require('../middleware/active');

const userController = require('../controllers/users.controller');

const router = express.Router();

/** get user detilas by user (only active user) */
router.get('/me', [auth, active], (req, res) => {
  return userController.findMe(req, res);
});

/** create a new user (only admin) */
router.post('/', (req, res) => {
  return userController.createUser(req, res);
});

/** find is user name available */
router.post('/name', (req, res) => {
  return userController.findUserName(req, res);
});

/** get all users details (only admin) */
router.get('/', [auth, admin], (req, res) => {
  return userController.getUsers(req, res);
});

/** get user details (only admin) */
router.get('/:id', [auth, admin], (req, res) => {
  return userController.getUser(req, res);
});

/** change user status (activate or deactivate) (only admin) */
router.put('/status/:id', [auth, admin], (req, res) => {
  return userController.changeUserStatus(req, res);
});

/** update user details (only admin) */
router.put('/:id', [auth, admin], (req, res) => {
  return userController.updateUser(req, res);
});

module.exports = router;
