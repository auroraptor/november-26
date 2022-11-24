const router = require('express').Router();
const { validateUserId, validateUser } = require('../middlewares/validate');
const {
  getUsers, getCurrentUser, updateUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', validateUserId, getCurrentUser);
router.patch('/me', validateUser, updateUser);

module.exports = router;
