const errorObj = require('../shared/error');

module.exports = (req, res, next) => {
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    return res.status(403)
      .json(errorObj.sendError(403, 'Access denied'));
  }

  next();
};
