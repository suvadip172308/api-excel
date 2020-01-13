const _ = require('lodash');
const Joi = require('joi');
const fs = require('path');

const excel = require('../shared/excel');
const pathController = require('../controllers/path.controller');
const transactionController = require('../controllers/transaction.controller');
const retailerController = require('../controllers/retailers.controller');
const errorObj = require('../shared/error');
const ERR_FILESTRUCTURE = require('../shared/const');
const validation = require('../validation/download.validation');

/** upload file */
exports.uploadFile = async (req, res) => {
  const fileName = req.file.originalname;
  const collectionName = req.body.collection;
  const filePath = `./public/upload/${fileName}`;

  const json = excel.parseExcel(fileName);
  const insertedData = await insertIntoDB(json, collectionName);
  excel.deleteFile(filePath);

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

const savePath = async (json) => {
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

    const newPath = await pathController.insertPath(path);
    paths.push(newPath);
  }

  return paths;
};

const saveTransaction = async (json) => {
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

    const newTransaction = await transactionController.insertTransaction(transaction);
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

/* download file */
exports.download = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.downloadSchema);

  if (error) {
    res.status(400);
    res.send(errorObj.sendError(400, error.details[0].message));
    return;
  }

  const collectionName = req.body.collection;
  const fromPage = req.body.fromPage;
  const toPage = req.body.toPage;
  const pageSize = req.body.pageSize;

  const fileName = `${collectionName}.xlsx`;
  const filePath = `./public/download/${fileName}`;

  const json = await fetchFromDB(collectionName, fromPage, toPage, pageSize);
  console.log('In Download', json);

  excel.generateExcel(json, fileName);

  const path = fs.join(__dirname, '../public/download');
  console.log(path);

  res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.sendFile(path, fileName);

  excel.deleteFile(filePath);
};

const fetchFromDB = async (collectionName, fromPage, toPage, pageSize) => {
  switch (collectionName) {
  case 'path':
    const pathList = await fetchPath(fromPage, toPage, pageSize);
    return pathList;

  case 'transaction':
    const transactionList = await fetchTransaction(fromPage, toPage, pageSize);
    return transactionList;

  case 'retailer':
    const retailerList = await fetchRetailer(fromPage, toPage, pageSize);
    return retailerList;
  default:
    return 0;
  }
};

const fetchPath = async (fromPage, toPage, pageSize) => {
  const paths = await pathController.findRangePaths(fromPage, toPage, pageSize);

  return paths.map(path => {
    return {
      Route_Id: path.pathId,
      Route_Name: path.pathName
    };
  });
};

const fetchTransaction = async (fromPage, toPage, pageSize) => {
  const transactions = await transactionController.findRangeTransaction(fromPage, toPage, pageSize);

  return transactions.map(transaction => {
    return {
      Retailer_Id: transaction.retailerId,
      Retailer_Name: transaction.retailerName,
      Company_Name: transaction.companyName,
      Route_Id: transaction.routeCode,
      Route_Name: transaction.routeName,
      Agent_Name: transaction.agentName,
      Invoice_Id: transaction.invoiceId,
      Invoice_Amount: transaction.invoiceAmount,
      Payment: transaction.payment,
      Operator_Name: transaction.operatorName
    };
  });
};

const fetchRetailer = async (fromPage, toPage, pageSize) => {
  const retailers = await retailerController.findRangeRetailer(fromPage, toPage, pageSize);

  return retailers.map(retailer => {
    return {
      Retailer_Id: retailer.retailerId,
      Retailer_Name: retailer.retailerName,
      Company_Name: retailer.companyName,
      Balance: retailer.balance
    };
  });
};
