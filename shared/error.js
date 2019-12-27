const {
  ERR_11000,
  ERR_11000_MESSAGE,
  ERR_FILESTRUCTURE
} = require('../shared/const');

function createErrorJSON(errCode, errMessage) {
  return {
    error: {
      code: errCode,
      message: errMessage
    }
  };
}

exports.sendError = (err, errMessage = null) => {
  switch (err) {
    case ERR_11000:
      return createErrorJSON(err, errMessage || ERR_11000_MESSAGE);
    case ERR_FILESTRUCTURE:
      return createErrorJSON(err, errMessage || ERR_FILESTRUCTURE);
    default:
      return createErrorJSON(err, errMessage || 'Unkown error Occured');
  }
};
