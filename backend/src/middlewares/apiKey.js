const crypto = require('crypto');
const ApiKey = require('../models/api-key.model');

const generateApiKey = async () => {
  const salt = crypto.randomBytes(16).toString('hex');
  const apiKey = crypto.randomBytes(64).toString('hex');
  const hash = crypto.pbkdf2Sync(apiKey, salt, 1000, 64, `sha512`).toString(`hex`);
  const apiKeyDoc = await ApiKey.create({ salt: salt, hash: hash });
  await apiKeyDoc.save()
  const id = apiKeyDoc._id;
  return { id, apiKey };
};


const validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const id = req.headers['x-api-key-id'];
    const apiKeyDoc = await ApiKey.findById(id);
    const hash = crypto.pbkdf2Sync(apiKey, apiKeyDoc.salt, 1000, 64, `sha512`).toString(`hex`)
    if (!apiKeyDoc || (hash !== apiKeyDoc.hash)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  } catch (error) {
    console.error('Error validating API key:', error);
    return res.status(500).json({ message: error })
  }
};

module.exports = {
  generateApiKey,
  validateApiKey,
}