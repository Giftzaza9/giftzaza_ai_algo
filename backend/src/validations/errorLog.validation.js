const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { errorPlatforms } = require('../config/errorLog');

const getErrorLog = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const getErrorLogs = {
  query: Joi.object().keys({
    sort: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    platform: Joi.string().valid(...Object.values(errorPlatforms)),
  }),
};

const deleteErrorLog = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

const createErrorLog = {
  body: Joi.object().keys({
    message: Joi.string().required(),
    platform: Joi.string()
      .valid(...Object.values(errorPlatforms))
      .required(),
    error_stack: Joi.string(),
    user: Joi.string(),
  }),
};

module.exports = {
  getErrorLog,
  getErrorLogs,
  createErrorLog,
  deleteErrorLog,
};
