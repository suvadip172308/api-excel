const xlsx = require('xlsx');

exports.parseExcel = (excelFile) => {
  const filePath = `./public/excels/${excelFile}`;

  const workBook = xlsx.readFile(filePath);
  const sheetNameList = workBook.SheetNames;
  const jsonData = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNameList[0]]);

  console.log('Parsing Excel File: ', excelFile);
  console.log(jsonData);
};
