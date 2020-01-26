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

/** Activate path by admin */
router.put('/activate', [auth, admin], (req, res) => {
  pathController.activatePaths(req, res);
});

router.put('/:id', [auth, active], (req, res) => {
  pathController.updatePath(req, res);
});

/** delete retailer only admin */
router.delete('/', [auth, admin], (req, res) => {
  pathController.deletePaths(req, res);
});

module.exports = router;
