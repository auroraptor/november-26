const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { HttpStatusCode } = require('../utils/HttpStatusCode');
const { HTTP401Error } = require('../errors/HTTP401Error');
const { HTTP409Error } = require('../errors/HTTP409Error');
const { HTTP404Error } = require('../errors/HTTP404Error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hash });
    const {
      name, email, _id: id,
    } = user;

    res.status(HttpStatusCode.OK).send({
      user: { name, email, id },
    });
  } catch (error) {
    if (error.name === 'MongoServerError' || error.message.includes('11000')) {
      next(new HTTP409Error(`${req.body.email} уже зарегестрирован`));
      return;
    }
    next(error);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 0;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    const { name, email } = req.query;
    const filter = {};

    if (name) filter.name = name;
    if (email) filter.email = email;

    const data = await User.find(filter).limit(pageSize).skip(pageSize * page);
    const users = data.map((item) => ({
      name: item.name, email: item.email, id: item._id,
    }));
    res.send(users);
  } catch (error) {
    next(error);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new HTTP404Error(`Пользователь с id ${req.user._id} не найден`));
      return;
    }
    const { name, email, _id: id } = user;

    res.status(HttpStatusCode.OK).send({
      user: { name, email, id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    const { name, email, _id: id } = user;

    res.status(HttpStatusCode.OK).send({
      user: { name, email, id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      next(new HTTP401Error('Неправильные почта или пароль'));
      return;
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      next(new HTTP401Error('Неправильные почта или пароль'));
      return;
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : '🔐', { expiresIn: '7d' });

    res.status(HttpStatusCode.OK).cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    }).send({ message: '🍪' }).end();
  } catch (error) {
    next(error);
  }
};
