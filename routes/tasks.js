const router = require('express').Router();
const { validateTask, validateTaskId } = require('../middlewares/validate');
const {
  createTask, getTasks, removeTask, updateTask,
} = require('../controllers/tasks');

router.get('/', getTasks);
router.post('/', validateTask, createTask);
router.patch('/:taskId', validateTaskId, updateTask);
router.delete('/:taskId', validateTaskId, removeTask);
// ?page=n&limit=m

module.exports = router;
