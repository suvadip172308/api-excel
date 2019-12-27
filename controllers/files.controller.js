const _ = require('lodash');

const excel = require('../shared/excel');
const pathController = require('../controllers/path.controller');
const transactionController = require('../controllers/transaction.controller');
const retailerController = require('../controllers/retailers.controller');
const errorObj = require('../shared/error');
const ERR_FILESTRUCTURE = require('../shared/const');

exports.uploadFile = (req, res) => {
  const fileName = req.file.originalname;
  const collectionName = req.body.collection;

  const json = excel.parseExcel(fileName);
  const insertedData = insertIntoDB(json, collectionName);
  excel.deleteFile(fileName);

  res.json(insertedData);
};

const insertIntoDB = (json, collectionName) => {
  switch (collectionName) {
    case 'path':
      return savePath(json);
    case 'transaction':
      return saveTransaction(json);
    case 'retailer':
      return saveRetailer(json);
    default:
      return 0;
  }
};

const savePath = (json) => {
  const row = json[0];
  const keyCount = _.keys(row).length;

  if (keyCount !== 2) {
    return errorObj.sendError(ERR_FILESTRUCTURE);
  }

  json.forEach(item => {
    const path = {
      pathId: item.Route_Id,
      pathName: item.Route_Name
    };

    // problem in handle returning promises Promise<pending>
    pathController.insertPath(path);
  });
};

const saveTransaction = (json) => {
  const row = json[0];
  const keyCount = _.keys(row).length;

  if (keyCount !== 10) {
    return errorObj.sendError(ERR_FILESTRUCTURE);
  }

  json.forEach(item => {
    const transaction = {
      retailerId: item.Retailer_Id,
      retailerName: item.Retailer_Name,
      companyName: item.Company_Name,
      routeCode: item.Route_Id,
      routeName: item.Route_Name,
      agentName: item.Agent_Name,
      invoiceId: item.Invoice_Id,
      invoiceAmount: parseFloat(item.Invoice_Amount),
      payment: parseFloat(item.Payment),
      operatorName: item.Operator_Name
    };

    // problem in handle returning promises Promise<pending>
    transactionController.insertTransaction(transaction);
  });
};

const saveRetailer = (json) => {
  const row = json[0];
  const keyCount = _.keys(row).length;

  if (keyCount !== 4) {
    return errorObj.sendError(ERR_FILESTRUCTURE);
  }

  json.forEach(item => {
    const retailer = {
      retailerId: item.Retailer_Id,
      retailerName: item.Retailer_Name,
      companyName: item.Company_Name,
      balance: item.Balance
    };

    retailerController.insertRetailer(retailer);
  });
};
