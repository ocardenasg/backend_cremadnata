const Order = require('../models/Order');
const { logAction } = require('../middleware/logger');
const { v4: uuidv4 } = require('uuid');

async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

async function createOrder(req, res) {
  const { products, payment_type, seller, client, total } = req.body;
  try {
    const order = new Order({
      id: uuidv4(),
      products,
      payment_type,
      seller,
      client,
      total,
      created_at: new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' })
    });
    await order.save();

    await logAction('orders', seller?.id, `Orden creada: ${order.id}`, { orderId: order.id, total });

    res.status(201).json({ message: 'Order created', orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
}

async function updateOrder(req, res) {
  try {
    const order = await Order.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await logAction('orders', req.user?.id, `Orden actualizada: ${req.params.id}`, { orderId: req.params.id });

    res.json({ message: 'Order updated', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order' });
  }
}

async function deleteOrder(req, res) {
  try {
    const order = await Order.findOneAndDelete({ id: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await logAction('orders', req.user?.id, `Orden eliminada: ${req.params.id}`, { orderId: req.params.id });

    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
}

module.exports = { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };