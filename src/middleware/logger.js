const { logOperation } = require('../services/logService');

function loggable(serviceName) {
  return async (req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
      const statusCode = res.statusCode;
      const userId = req.user?.id || null;
      const description = `${req.method} ${req.originalUrl} - Status: ${statusCode}`;
      const tags = {
        method: req.method,
        path: req.originalUrl,
        body: req.body ? JSON.stringify(req.body) : null,
        params: req.params,
        query: req.query,
        status: statusCode
      };

      if (statusCode >= 400) {
        logOperation(serviceName, userId, description, tags);
      }

      originalSend.call(this, data);
    };
    next();
  };
}

async function logAction(serviceName, userId, description, tags = {}) {
  await logOperation(serviceName, userId, description, tags);
}

module.exports = { loggable, logAction };