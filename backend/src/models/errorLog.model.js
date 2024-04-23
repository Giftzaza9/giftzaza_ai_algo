const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { errorPlatforms } = require('../config/errorLog');

const errorLogSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    platform: {
      type: String,
      enum: [errorPlatforms.AI, errorPlatforms.BE, errorPlatforms.FE],
      required: true,
      index: true,
    },
    error_stack: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
errorLogSchema.plugin(toJSON);

/**
 * @typedef ErrorLog
 */
const ErrorLog = mongoose.model('ErrorLog', errorLogSchema);

module.exports = ErrorLog;
