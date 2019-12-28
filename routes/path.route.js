const express = require('express');

const pathController = require('../controllers/path.controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const active = require('../middleware/active');

const router = express.Router();

router.get('/', [auth, active], (req, res) => {
  pathController.getPaths(req, res);
});

router.get('/:id', [auth, active], (req, res) => {
  pathController.getPath(req, res);
});

router.post('/', [auth, active], (req, res) => {
  pathController.createPath(req, res);
});

router.put('/:id', [auth, active], (req, res) => {
  pathController.updatePath(req, res);
});

/** delete retailer only admin */
router.delete('/:id', [auth, admin], (req, res) => {
  pathController.deletePath(req, res);
});

module.exports = router;
