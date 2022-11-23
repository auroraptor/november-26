const Item = require('../models/item');

const { HttpStatusCode } = require('../utils/HttpStatusCode');
const { HTTP404Error } = require('../errors/HTTP404Error');
const { HTTP403Error } = require('../errors/HTTP403Error');

module.exports.createItem = async (req, res, next) => {
  try {
    const item = await Item.create({ ...req.body, owner: req.user._id });
    res.status(HttpStatusCode.OK).send(item);
  } catch (error) {
    next(error);
  }
};

module.exports.getItems = async (req, res, next) => {
  try {
    const items = await Items.find({});
    res.status(HttpStatusCode.OK).send(items);
  } catch (error) {
    next(error);
  }
};

module.exports.updateItem = async (req, res, next) => {
  try {
    const item = await User.findByIdAndUpdate(req.item._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.send(item);
  } catch (error) {
    next(error);
  }
};

module.exports.removeItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (item === null) {
      next(new HTTP404Error(`Задача с id ${req.params.cardId} не найдена`));
      return;
    } if (item.owner.toHexString() !== req.user._id) {
      next(new HTTP403Error('Можно удалять только свои задачи'));
      return;
    }
    await item.delete();
    res.status(HttpStatusCode.OK).send({ message: `Задача с id ${req.params.cardId} удалена` });
  } catch (error) {
    next(error);
  }
};

