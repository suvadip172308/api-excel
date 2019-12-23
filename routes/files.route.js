const express = require('express');
const multer = require('multer');
//const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
  dest: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});
const upload = multer({ storage: storage }).single('file');


const filesController = require('../controllers/files.controller');
const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');
const active = require('../middleware/active');

const router = express.Router();

router.post('/', [auth, active, upload], (req, res) => {
  filesController.uploadFile(req, res, upload);
});

module.exports = router;
