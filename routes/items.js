const router = require('express').Router();
// const { validateItem, validateItemId } = require('../middlewares/validate');
const {
  createItem, getItems, removeItem, updateItem, paginItems,
} = require('../controllers/items');

router.get('/', getItems);
router.post('/', createItem);
router.patch('/:itemId', updateItem);
router.delete('/:itemId', removeItem);
router.get('/:page', paginItems);

module.exports = router;
