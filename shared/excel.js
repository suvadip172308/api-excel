const xlsx = require('xlsx');

exports.parseExcel = (excelName) => {
  console.log('In Parse Excel file', excelName);

  const workBook = xlsx.readFile(excelName);
  const sheetNameList = workBook.SheetNames;
  const jsonData = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNameList[0]]);

  console.log(jsonData);
};
