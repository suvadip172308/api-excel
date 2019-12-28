const _ = require('lodash');

const excel = require('../shared/excel');
const pathController = require('../controllers/path.controller');
const transactionController = require('../controllers/transaction.controller');
const retailerController = require('../controllers/retailers.controller');
const errorObj = require('../shared/error');
const ERR_FILESTRUCTURE = require('../shared/const');

exports.uploadFile = async (req, res) => {
  const fileName = req.file.originalname;
  const collectionName = req.body.collection;

  const json = excel.parseExcel(fileName);
  const insertedData = await insertIntoDB(json, collectionName);
  excel.deleteFile(fileName);

  res.json(insertedData);
};

const insertIntoDB = async (json, collectionName) => {
  switch (collectionName) {
  case 'path':
    const pathList = await savePath(json);
    return pathList;
  case 'transaction':
    const transactionList = await saveTransaction(json);
    return transactionList;
  case 'retailer':
    const retailerList = await saveRetailer(json);
    return retailerList;
  default:
    return 0;
  }
};

const savePath = (json) => {
  let paths = [];
  const row = json[0];
  const keyCount = _.keys(row).length;

  if (keyCount !== 2) {
    return errorObj.sendError(ERR_FILESTRUCTURE);
  }

  for (let item of json) {
    const path = {
      pathId: item.Route_Id,
      pathName: item.Route_Name
    };

    const newPath = pathController.insertPath(path);
    paths.push(newPath);
  }

  return paths;
};

const saveTransaction = (json) => {
  let transactions = [];
  const row = json[0];
  const keyCount = _.keys(row).length;

  if (keyCount !== 10) {
    return errorObj.sendError(ERR_FILESTRUCTURE);
  }

  for (let item of json) {
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

    const newTransaction = transactionController.insertTransaction(transaction);
    transactions.push(newTransaction);
  }

  return transactions;
};

const saveRetailer = async (json) => {
  const reatilers = [];
  const row = json[0];
  const keyCount = _.keys(row).length;

  if (keyCount !== 4) {
    return errorObj.sendError(ERR_FILESTRUCTURE);
  }

  for (let item of json) {
    const retailer = {
      retailerId: item.Retailer_Id,
      retailerName: item.Retailer_Name,
      companyName: item.Company_Name,
      balance: item.Balance
    };

    const newRetailers = await retailerController.insertRetailer(retailer);
    reatilers.push(newRetailers);
  }

  return reatilers;
};
