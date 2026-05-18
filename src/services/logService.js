const Log = require('../models/Log');
const { v4: uuidv4 } = require('uuid');

let isAtlasConnected = false;

async function setAtlasStatus(status) {
  isAtlasConnected = status;
}

async function logOperation(service, userId, description = '', tags = {}) {
  if (!isAtlasConnected) {
    console.log(`[LOG SKIPPED] ${service} - ${description}`);
    return;
  }

  try {
    const logEntry = new Log({
      id: uuidv4(),
      service,
      user_id: userId || 'system',
      description,
      tags
    });
    await logEntry.save();
  } catch (err) {
    console.error('Error saving log to Atlas:', err);
  }
}

module.exports = { logOperation, setAtlasStatus };