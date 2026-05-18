const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, requireRole('admin', 'seller'), createProduct);
router.put('/:id', authenticateToken, requireRole('admin', 'seller'), updateProduct);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteProduct);

module.exports = router;