const xlsx = require('xlsx');
const fs = require('fs');

exports.parseExcel = (excelFile) => {
  const filePath = `./public/excels/${excelFile}`;

  const workBook = xlsx.readFile(filePath);
  const sheetNameList = workBook.SheetNames;
  const jsonFormatedData = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNameList[0]]);

  return jsonFormatedData;
};

/** Delete a file */
exports.deleteFile = (fileName) => {
  const filePath = `./public/excels/${fileName}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      new Error('File cant be deleted');
      return false;
    }

    return true;
  });
};
