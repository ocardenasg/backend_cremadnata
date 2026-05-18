const mongoose = require('mongoose');
require('dotenv').config();

const mongoAtlasUri = process.env.MONGO_ATLAS_URI;

async function connectMongoAtlas() {
  if (!mongoAtlasUri || mongoAtlasUri.includes('<user>')) {
    console.warn('MongoDB Atlas URI not configured. Logging to Atlas disabled.');
    return false;
  }
  try {
    await mongoose.connect(mongoAtlasUri);
    console.log('Connected to MongoDB Atlas');
    return true;
  } catch (err) {
    console.error('MongoDB Atlas connection error:', err);
    return false;
  }
}

module.exports = { connectMongoAtlas };