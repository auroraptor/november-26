const router = require('express').Router();
// const { validateItem, validateItemId } = require('../middlewares/validate');
const {
  createItem, getItems, removeItem, updateItem
} = require('../controllers/items');

router.get('/', getItems);
router.post('/', createItem);
router.patch('/:itemId', updateItem);
router.delete('/:itemId',  removeItem);

module.exports = router;

