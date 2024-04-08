const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { availableActivities } = require('../variables/constants');

const createUserActivity = {
  body: Joi.object().keys({
    product_id: Joi.string().custom(objectId),
    activity: Joi.string().allow(...availableActivities),
    profile_id: Joi.string().custom(objectId),
  }),
};

const removeSavedProduct = {
  body: Joi.object().keys({
    profile_id: Joi.string().custom(objectId),
    product_id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUserActivity,
  removeSavedProduct,
};
