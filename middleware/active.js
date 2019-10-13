const errorObj = require('../shared/error');

module.exports = (req, res, next) => {
  const isActive = req.user.isActive;

  if (!isActive) {
    return res.status(403)
      .json(errorObj.sendError(403, 'Access denied: User is not active'));
  }

  next();
};
