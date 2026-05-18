const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } = require('../controllers/orderController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', authenticateToken, requireRole('admin', 'seller'), getAllOrders);
router.get('/:id', authenticateToken, requireRole('admin', 'seller', 'client'), getOrderById);
router.post('/', authenticateToken, requireRole('admin', 'seller'), createOrder);
router.put('/:id', authenticateToken, requireRole('admin', 'seller'), updateOrder);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteOrder);

module.exports = router;