const excel = require('../shared/excel');

exports.uploadFile = (req, res, upload) => {
  console.log('In file controller');
  console.log(req.file);

  // const fileName = req.file.originalname;

  // excel.parseExcel(fileName);

  // res.json({
  //   message: 'Data uploaded'
  // });

  upload(req, res, function (err) {
    if (err) {
      return res.end('Error uploading file.');
    }
    res.json({
      message: 'Data uploaded'
    });
  });
};
