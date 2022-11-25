/* eslint-disable max-len */
const Task = require('../models/task');

const { HttpStatusCode } = require('../utils/HttpStatusCode');
const { HTTP404Error } = require('../errors/HTTP404Error');
const { HTTP403Error } = require('../errors/HTTP403Error');
/**  Создание нового айтема
 * req.body {string} - текст задачи
 * req.user._id {string} - айди пользователя
*/
module.exports.createTask = async (req, res, next) => {
  try {
    const data = await Task.create({ ...req.body, createdBy: req.user._id });
    const {
      name, description, createdBy: owner, _id: id,
    } = data;
    res.status(HttpStatusCode.OK).send({
      task: {
        name, description, id, owner,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getTasks = async (req, res, next) => {
  try {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 0;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    const {
      name, description,
    } = req.query;

    const filter = {};
    if (name) {
      filter.name = name;
    }
    if (description) {
      filter.description = description;
    }

    const data = await Task.find(filter).limit(pageSize).skip(pageSize * page);
    const tasks = data.map((item) => ({
      name: item.name, description: item.description, id: item._id, owner: item.createdBy,
    }));
    res.status(HttpStatusCode.OK).send(tasks);
  } catch (error) {
    next(error);
  }
};

/**  апдейт текста айтема */
module.exports.updateTask = async (req, res, next) => {
  try {
    const item = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true, runValidators: true });
    if (item === null) {
      next(new HTTP404Error(`Задача с id ${req.params.taskId} не найдена`));
      return;
    }
    res.status(HttpStatusCode.OK).send(item);
  } catch (error) {
    next(error);
  }
};

/**  удалять айтем
 * проверять создателя айтема по совпадению id чтобы у пользователя
 * не было возможности удалить списки других пользователей
*/
module.exports.removeTask = async (req, res, next) => {
  try {
    const item = await Task.findById(req.params.TaskId);
    if (item === null) {
      next(new HTTP404Error(`Задача с id ${req.params.TaskId} не найдена`));
      return;
    } if (item.createdBy.toHexString() !== req.user._id) {
      next(new HTTP403Error('Можно удалять только свои задачи'));
      return;
    }
    await Task.delete();
    res.status(HttpStatusCode.OK).send({ message: `Задача с id ${req.params.TaskId} удалена` });
  } catch (error) {
    next(error);
  }
};
