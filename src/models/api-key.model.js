const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
    salt: {
        type: String,
        required: true,
        unique: true,
    },
    hash: {
        type: String,
        required: true,
        unique: true,
    }
});

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

module.exports = ApiKey;
