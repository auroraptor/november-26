const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const HttpStatusCode = require('../utils/HttpStatusCode');
const { HTTP401Error, HTTP404Error, HTTP409Error } = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

/**
 * @module createUser
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} req.body
 * @param {String} req.body.name
 * @param {String} req.body.email
 * @param {String} req.body.password
 * @param {Function} next
 */
module.exports.createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hash });
    const {
      name, email, id,
    } = user;
    res.status(HttpStatusCode.OK).send({ name, email, id });
  } catch (error) {
    if (error.name === 'MongoServerError' || error.message.includes('11000')) {
      next(new HTTP409Error(`Пользователь с ${req.body.email} уже зарегестрирован`));
      return;
    }
    next(error);
  }
};

/**
 * @module getUsers
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} req.query
 * @param {Number=} req.query.page
 * @param {Number=} req.query.pageSize
 * @param {String=} req.query.name
 * @param {String=} req.query.email
 * @param {Function} next
 */
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

/**
 * @module getCurrentUser
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} req.user
 * @param {String} req.user.id
 * @param {Function} next
 */
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      next(new HTTP404Error(`Пользователь с id ${req.user.id} не найден`));
      return;
    }

    res.status(HttpStatusCode.OK).send(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @module updateUser
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} req.user
 * @param {String} req.user.id
 * @param {Object} req.body
 * @param {String=} req.body.name
 * @param {String=} req.body.email
 * @param {Function} next
 */
module.exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(HttpStatusCode.OK).send(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @module login
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} req.body
 * @param {String} req.body.email
 * @param {String} req.body.password
 * @param {Function} next
 */
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
    const token = jwt.sign({ id: user.id }, NODE_ENV === 'production' ? JWT_SECRET : '🔐', { expiresIn: '7d' });
    res.status(HttpStatusCode.OK).cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    }).end();
  } catch (error) {
    next(error);
  }
};
