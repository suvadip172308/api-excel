const errorObj = require('../shared/error');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401)
      .json(errorObj.sendError(401, 'Access denied. No token provided'));
  }

  try {
    req.user = jwt.verify(token, config.get('jwtKey'));
    next();
  } catch (err) {
    return res.status(400)
      .json(errorObj.sendError(400, 'Invalid token'));
  }
};
