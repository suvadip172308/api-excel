const xlsx = require('xlsx');
const fs = require('fs');

/** get json from excel */
exports.parseExcel = (excelFile) => {
  const fileUploadPath = `./public/upload/${excelFile}`;

  const workBook = xlsx.readFile(fileUploadPath);
  const sheetNameList = workBook.SheetNames;
  const jsonFormatedData = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNameList[0]]);

  return jsonFormatedData;
};

/** Get excel from json */
exports.generateExcel = (json, fileName = 'excel.xlsx', sheetName = 'Sheet') => {
  const fileDownloadPath = `./public/download/${fileName}`;

  const workBook = xlsx.utils.book_new();
  const workSheet = xlsx.utils.json_to_sheet(json);

  xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
  xlsx.writeFile(workBook, fileDownloadPath);
};

/** Delete a file */
exports.deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      new Error('File cant be deleted');
      return false;
    }

    return true;
  });
};
