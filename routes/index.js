const router = require('express').Router();
const userRouter = require('./users');
const taskRouter = require('./tasks');
const auth = require('../middlewares/auth');
const { validateUserBody, validateAuth } = require('../middlewares/validate');
const { login, createUser } = require('../controllers/users');
const { HTTP404Error } = require('../errors/HTTP404Error');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuth, login);
router.use('/', auth);
router.use('/users', userRouter);
router.use('/tasks', taskRouter);
router.post('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: '🍪 cleared' }).end();
});
router.use((req, res, next) => {
  next(new HTTP404Error(`По адресу ${req.baseUrl} ничего не нашлось`));
});

module.exports = router;
