const {
  ERR_11000,
  ERR_11000_MESSAGE,
  ERR_601
} = require('../shared/const');

const CUSTOM_ERR = 'Custom Error';

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
  case ERR_601:
    return createErrorJSON(errCode, errMessage || CUSTOM_ERR);
  default:
    return 'Unkown error Occured';
  }
};
