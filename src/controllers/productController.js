const { getConnection } = require('../config/database');
const { logAction } = require('../middleware/logger');

async function getAllProducts(req, res) {
  try {
    const conn = await getConnection();
    const products = await conn.query('SELECT * FROM products ORDER BY created_at DESC');
    conn.release();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

async function getProductById(req, res) {
  try {
    const conn = await getConnection();
    const products = await conn.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    conn.release();
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(products[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

async function createProduct(req, res) {
  const { id, name, description, price, cost, category, size, image, stock, provider } = req.body;
  try {
    const conn = await getConnection();
    const result = await conn.query(
      `INSERT INTO products (id, name, description, price, cost, category, size, image, stock, provider)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, description, price, cost, category, size, image, stock || 0, provider]
    );
    conn.release();

    await logAction('products', req.user?.id, `Producto creado: ${name}`, { productId: id });

    res.status(201).json({ message: 'Product created', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
}

async function updateProduct(req, res) {
  const { name, description, price, cost, category, size, image, stock, provider } = req.body;
  try {
    const conn = await getConnection();
    const result = await conn.query(
      `UPDATE products SET name = ?, description = ?, price = ?, cost = ?, category = ?, size = ?, image = ?, stock = ?, provider = ? WHERE id = ?`,
      [name, description, price, cost, category, size, image, stock, provider, req.params.id]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await logAction('products', req.user?.id, `Producto actualizado: ${req.params.id}`, { productId: req.params.id });

    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

async function deleteProduct(req, res) {
  try {
    const conn = await getConnection();
    const result = await conn.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await logAction('products', req.user?.id, `Producto eliminado: ${req.params.id}`, { productId: req.params.id });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };