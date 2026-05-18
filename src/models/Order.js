const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  products: [{
    id: String,
    name: String,
    quantity: Number,
    unit_price: Number,
    total_price: Number
  }],
  payment_type: {
    type: {
      type: String,
      enum: ['cash', 'transfer', 'mixed'],
      default: 'cash'
    },
    cash_amount: Number,
    transfer_reference: String
  },
  seller: {
    id: String,
    name: String
  },
  client: {
    id: String,
    name: String,
    email: String,
    whatsapp: String
  },
  total: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: () => new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' })
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);