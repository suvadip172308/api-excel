const excel = require('../shared/excel');

exports.uploadFile = (req, res) => {
  const fileName = req.file.originalname;

  excel.parseExcel(fileName);
  //put all data into db
  excel.deleteFile(fileName);

  res.json({
    message: 'successfully uploaded'
  });
};
