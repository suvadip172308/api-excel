const excel = require('../shared/excel');
const pathController = require('../controllers/path.controller');
const transactionController = require('../controllers/transaction.controller');
const retailerController = require('../controllers/retailers.controller');

exports.uploadFile = (req, res) => {
  const fileName = req.file.originalname;
  const collectionName = req.collection || 'retailer';

  const json = excel.parseExcel(fileName);
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
    case 'transaction':
      saveTransaction(json);
      break;
    case 'retailer':
      saveRetailer(json);
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

const saveTransaction = (json) => {
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

    return transactionController.insertTransaction(transaction);
  });
};

const saveRetailer = (json) => {
  json.forEach(item => {
    const retailer = {
      retailerId: item.Retailer_Id,
      retailerName: item.Retailer_Name,
      companyName: item.Company_Name,
      balance: item.Balance
    };

    return retailerController.insertRetailer(retailer);
  });
};
