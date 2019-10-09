const {
  ERR_11000,
  ERR_11000_MESSAGE
} = require('../shared/const');

function createErrorJSON(errCode, errMessage) {
  return {
    error: {
      code: errCode,
      message: errMessage
    }
  };
}

exports.sendError = (errCode, errMessage = null) => {
  switch (errCode) {
  case ERR_11000:
    return createErrorJSON(errCode, errMessage || ERR_11000_MESSAGE);
  default:
    return createErrorJSON(errCode, errMessage || 'Unkown error Occured');
  }
};
