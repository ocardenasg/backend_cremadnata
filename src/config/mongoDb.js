const mongoose = require('mongoose');
require('dotenv').config();

const mongoDBUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

async function connectMongoDB() {
  try {
    await mongoose.connect(mongoDBUrl);
    console.log('Connected to MongoDB (Docker)');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = { connectMongoDB };