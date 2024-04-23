const { errorPlatforms } = require('../config/errorLog');
const { errorLogService } = require('../services');

/**
 *
 * @param {string} error_message Error message
 * @param {string} user user_id User id
 * @param {string} platform value of errorPlatforms
 * @param {string} error_stack error stack
 */
const logError = async (error_message, user = null, error_stack = '', platform = errorPlatforms.BE) => {
  try {
    const payload = {
      message: error_message,
      platform: platform,
      user: user,
      error_stack: error_stack,
    };
    await errorLogService.createErrorLog(payload);
  } catch (error) {
    console.error(error);
  }
};

module.exports = logError;
