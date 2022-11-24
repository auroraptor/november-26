const router = require('express').Router();
const { validateItem, validateItemId } = require('../middlewares/validate');
const {
  createItem, getItems, removeItem, updateItem, paginItems,
} = require('../controllers/items');

router.get('/', getItems);
router.post('/', validateItem, createItem);
router.patch('/:itemId', validateItemId, updateItem);
router.delete('/:itemId', validateItemId, removeItem);
router.get('/:page', paginItems);

module.exports = router;
