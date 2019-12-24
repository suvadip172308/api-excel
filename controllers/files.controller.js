const excel = require('../shared/excel');
const pathController = require('../controllers/path.controller');

exports.uploadFile = (req, res) => {
  const fileName = req.file.originalname;
  const collectionName = req.collection || 'path';

  const json = excel.parseExcel(fileName);
  //put all data into db
  insertIntoDB(json, collectionName);
  excel.deleteFile(fileName);

  res.json({
    message: 'successfully uploaded'
  });
};

const insertIntoDB = (json, collectionName) => {
  switch (collectionName) {
    case 'path':
      savePath(json);
      break;
    case 'user':
      saveUser(json);
      break;
    default:
      return 0;
  }
};

const savePath = (json) => {
  json.forEach(item => {
    const path = {
      pathId: item.Route_Id,
      pathName: item.Route_Name
    };

    return pathController.insertPath(path);
  });
};
