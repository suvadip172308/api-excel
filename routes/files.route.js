const express = require('express');
const multer = require('multer');

const filesController = require('../controllers/files.controller');
const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');
const active = require('../middleware/active');

const extList = ['xlsx', 'xls'];

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, './public/upload');
  },
  filename: function (req, file, next) {
    next(null, file.originalname);
  }
});

const fileFilter = (req, file, next) => {
  const ext = file.originalname.split('.')[1];
  const isCorrectExt = extList.includes(ext);
  if (!isCorrectExt) {
    return next(null, false, new Error('File type is not correct'));
  }
  next(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
}).single('file');

const router = express.Router();

router.post('/upload', [auth, active, upload], (req, res) => {
  filesController.uploadFile(req, res);
});

router.post('/download', [auth, active], (req, res) => {
  filesController.download(req, res);
});

module.exports = router;
