const Task = require('../models/task');

const HttpStatusCode = require('../utils/HttpStatusCode');
const { HTTP403Error, HTTP404Error } = require('../utils/errors');

/**
 * @module createTask
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} req.body
 * @param {String} req.body.name
 * @param {String=} req.body.description
 * @param {Function} next
 */
module.exports.createTask = async (req, res, next) => {
  try {
    const item = await Task.create({ ...req.body, createdBy: req.user.id });
    res.status(HttpStatusCode.OK).send(item);
  } catch (error) {
    next(error);
  }
};

/**
 * @module getTasks
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} req.query
 * @param {Number=} req.query.page
 * @param {Number=} req.query.pageSize
 * @param {String=} req.query.name
 * @param {String=} req.query.description
 * @param {Object} req.body
 * @param {Object} req.user
 * @param {String} req.user.id
 * @param {Function} next
 */
module.exports.getTasks = async (req, res, next) => {
  try {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 0;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    const { name, description } = req.query;
    const createdBy = req.user.id;
    const filter = { createdBy };

    if (name) filter.name = name;
    if (description) filter.description = description;

    const data = await Task.find(filter).limit(pageSize).skip(pageSize * page);

    res.status(HttpStatusCode.OK).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * @module updateTask
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} req.params
 * @param {String} req.params.taskId
 * @param {Object} req.body
 * @param {String=} req.body.name
 * @param {String=} req.body.description
 * @param {Object} req.user
 * @param {String} req.user.id
 * @param {Function} next
 */
module.exports.updateTask = async (req, res, next) => {
  try {
    const item = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
      new: true,
      runValidators: true,
    });

    if (item === null) {
      next(new HTTP404Error(`Задача с id ${req.params.taskId} не найдена`));
      return;
    }

    if (item.createdBy.toHexString() !== req.user.id) {
      next(new HTTP403Error('Можно редактировать только свои задачи'));
      return;
    }

    res.status(HttpStatusCode.OK).send(item);
  } catch (error) {
    next(error);
  }
};

/**
 * @module removeTask
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} req.params
 * @param {String} req.params.taskId
 * @param {Object} req.user
 * @param {String} req.user.id
 * @param {Function} next
 */
module.exports.removeTask = async (req, res, next) => {
  try {
    const item = await Task.findById(req.params.taskId);

    if (item === null) {
      next(new HTTP404Error(`Задача с id ${req.params.taskId} не найдена`));
      return;
    }
    if (item.createdBy.toHexString() !== req.user.id) {
      next(new HTTP403Error('Можно удалять только свои задачи'));
      return;
    }
    await item.delete();
    res.status(HttpStatusCode.OK).send({ message: `Задача с id ${req.params.taskId} удалена` });
  } catch (error) {
    next(error);
  }
};
