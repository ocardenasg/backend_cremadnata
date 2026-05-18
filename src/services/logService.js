const Log = require('../models/Log');
const crypto = require('crypto');

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
      id: crypto.randomUUID(),
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