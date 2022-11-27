const router = require('express').Router();
const userRouter = require('./users');
const taskRouter = require('./tasks');
const auth = require('../middlewares/auth');
const { validateUserBody, validateAuth } = require('../middlewares/validate');
const { login, createUser } = require('../controllers/users');
const { HTTP404Error } = require('../utils/errors');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuth, login);
router.use('/', auth);

router.use('/users', userRouter);
router.use('/tasks', taskRouter);

/**
 * есть идея написать комментарий о том что ответы, который направлены пользователю
 * написаны на русском, а сообщения про куки например проверки ради отправляются на англ
 */
router.post('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: '🍪 cleared' }).end();
});
router.use((req, res, next) => {
  next(new HTTP404Error(`По адресу ${req.baseUrl} ничего не нашлось`));
});

module.exports = router;
