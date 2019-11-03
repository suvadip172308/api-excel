const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');
var moment = require('moment');

module.exports.getStream = () => {
  const logDirectory = path.join(__dirname, '../logs');

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  const accessLogStream = rfs('access.log', {
    size: '2M', // rotate every 2 MegaBytes written
    interval: '1d', // rotate daily
    path: logDirectory
  });

  const errorLogStream = rfs('error.log', {
    size: '2M', // rotate every 2 MegaBytes written
    interval: '1d', // rotate daily
    path: logDirectory
  });

  return {
    accessLogStream,
    errorLogStream
  };
};

/** Get today's date */
module.exports.getDate = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
};
