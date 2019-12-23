const excel = require('../shared/excel');

exports.uploadFile = (req, res) => {
  console.log('In file controller');
  console.log(req.file);

  // const fileName = req.file.originalname;

  // excel.parseExcel(fileName);

  res.json({
    message: 'Data uploaded'
  });
};
