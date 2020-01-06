const Joi = require('joi');

const { Path } = require('../models/model.js');
const validation = require('../validation/path.validation');
const errorObj = require('../shared/error');

/** Get all paths */
exports.getPaths = async (req, res) => {
  const offset = parseInt(req.query.offset, 10) || 1;
  const pageSize = parseInt(req.query.size, 10) || 10;

  if (offset < 1) {
    return res.status(400).json(errorObj.sendError('Offset should more than 0'));
  }

  if (pageSize > 100) {
    return res.status(400).json(errorObj.sendError('Page size should less than 100'));
  }

  try {
    const paths = await Path.find()
      .skip((offset - 1) * pageSize)
      .limit(pageSize);

    const count = await Path.count();

    res.status(200);
    return res.json({
      data: paths,
      totalElements: count,
      pageSize,
      offset
    });
  } catch (err) {
    res.send(errorObj.sendError(err.code));
  }
};

exports.findRangePaths = async (fromPage, toPage, pageSize) => {
  const size = parseInt(pageSize, 10) || 10;

  const count = await Path.count();

  const totalPage = Math.ceil(count / size);

  const from = parseInt(fromPage, 10) || 1;
  const to = parseInt(toPage, 10) || totalPage;

  if (from < 1) {
    new Error('fromPage should greater than 0');
  }

  if (size > 0) {
    new Error('pageSize should greater than 0');
  }

  if (to > count) {
    new Error(`toPage should less or equal than ${totalPage}`);
  }

  if (to < from) {
    new Error('toPage should be greater or equal to fromPage');
  }

  try {
    const paths = await Path.find()
      .skip((from - 1) * size)
      .limit((to - from) * size);

    return paths;
  } catch (err) {
    return err;
  }
};

/** Get a retailer */
exports.getPath = async (req, res) => {
  const id = req.params.id;

  try {
    const path = await this.getPathById(id);
    res.status(200);
    res.json(path);
  } catch (err) {
    res.send(errorObj.sendError(err.code, 'Id not found'));
  }
};

exports.getPathById = async (id) => {
  const path = await Path.findOne({ pathId: id });
  return path;
};

/** create a new path */
exports.createPath = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.pathCreateSchema);

  if (error) {
    res.status(400);
    res.send(errorObj.sendError(400, error.details[0].message));
    return;
  }

  try {
    const path = await this.insertPath(req.body);
    res.json(path);
  } catch (err) {
    res.status(500).sendError('Data is not saved');
  }
};

/** insert path in db */
exports.insertPath = async (pathData) => {
  const {
    pathId, pathName
  } = { ...pathData };

  try {
    const createdPath = await new Path({ pathId, pathName }).save();
    return createdPath;
  } catch (err) {
    return new Error('Insertion in path collection is failed');
  }
};

/** update path */
exports.updatePath = async (req, res) => {
  const { error } = Joi.validate(req.body, validation.pathUpdateSchema);

  if (error) {
    res.status(400);
    res.json(errorObj.sendError(400, error.details[0].message));
    return;
  }

  const { pathId, pathName } = { ...req.body };

  if (!pathId
    && !pathName
  ) {
    res.json(errorObj.sendError(403));
    return;
  }

  try {
    const id = req.params.id;
    const updatedPath = await this.modifyPath(id, req.body);
    return res.status(200).json(updatedPath);
  } catch (err) {
    return res.json(errorObj.sendError(err.code, 'Id not found'));
  }
};

exports.modifyPath = async (id, payload) => {
  const { pathId, pathName } = { ...payload };

  let updateObject = {};

  if (pathId) {
    updateObject.pathId = pathId;
  }

  if (pathName) {
    updateObject.pathName = pathName;
  }

  const updatedPath = await Path.findOneAndUpdate(
    { _id: id },
    { $set: updateObject },
    { new: true }
  );

  return updatedPath;
};
