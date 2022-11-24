const Item = require('../models/item');

const { HttpStatusCode } = require('../utils/HttpStatusCode');
const { HTTP404Error } = require('../errors/HTTP404Error');
const { HTTP403Error } = require('../errors/HTTP403Error');
const { logNow } = require('../utils/log');

module.exports.createItem = async (req, res, next) => {
  try {
    const item = await Item.create({ ...req.body, owner: req.user._id });
    const { task, owner, _id} = item;
    res.status(HttpStatusCode.OK).send({task, owner, itemId: _id});
  } catch (error) {
    next(error);
  }
};

module.exports.getItems = async (req, res, next) => {
  try {
    const items = await Item.find({});
    const resItems = items.map(item => ({task: item.task, itemId: item._id, owner: item.owner}))
    res.status(HttpStatusCode.OK).send(resItems);
  } catch (error) {
    next(error);
  }
};

module.exports.paginItems = async (req, res, next) => {
  const { pageSize } = req.body;
  const { page } = req.params;
  try{
     const items = await Item.find().skip(page > 0 ? ((page - 1) * pageSize) : 0).limit(pageSize);
     const resItems = items.map(item => ({task: item.task, itemId: item._id, owner: item.owner}))
     res.status(HttpStatusCode.OK).send(resItems);
  } catch (error) {
    next(error);
  }
}

// TODO
// module.exports.getItemsByCreatedDate = async (req, res, next) => {
//   const { date } = req.params;
//   const dateParse = Date.parse(`${date} 00:00:00`);
//   const { timestamp } = req.body;
//   const endTime = dateParse + 3600 * 24 * timestamp * 1000;

//   try{
//      const items = await Item.find({'createdAt': { $gte: new Date(date).toISOString(), $lt: new Date(endTime).toISOString()}});
//      const resItems = items.map(item => ({task: item.task, itemId: item._id, owner: item.owner}))
//      res.status(HttpStatusCode.OK).send(resItems);
//   } catch (error) {
//     next(error);
//   }
// };

module.exports.updateItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.itemId, req.body, { new: true, runValidators: true,},
    );
    if (item === null) {
      next(new HTTP404Error(`Задача с id ${req.params.itemId} не найдена`));
      return;
    }
    const { task, owner, _id} = item;
    res.status(HttpStatusCode.OK).send({task, owner, itemId: _id});
  } catch (error) {
    next(error);
  }
};

module.exports.removeItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (item === null) {
      next(new HTTP404Error(`Задача с id ${req.params.itemId} не найдена`));
      return;
    } if (item.owner.toHexString() !== req.user._id) {
      next(new HTTP403Error('Можно удалять только свои задачи'));
      return;
    }
    await item.delete();
    res.status(HttpStatusCode.OK).send({ message: `Задача с id ${req.params.itemId} удалена` });
  } catch (error) {
    next(error);
  }
};
