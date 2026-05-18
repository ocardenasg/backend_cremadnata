const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  service: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: () => new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' })
  },
  user_id: String,
  description: String,
  tags: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);