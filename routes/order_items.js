const express = require('express');
const router = express.Router();
const order_itemsController = require('../controllers/order_itemsController');

router.post('/', order_itemsController.addItemToOrder);
router.get('/order/:orderId', order_itemsController.getItemsByOrderId);
router.put('/:id', order_itemsController.updateOrderItem);
router.delete('/:id', order_itemsController.removeItemFromOrder);

module.exports = router;