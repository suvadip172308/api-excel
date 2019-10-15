const errorObj = require('../shared/error');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const authorization = req.header('Authorization');
  const token = authorization ? authorization.split(' ')[1] : null;

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
