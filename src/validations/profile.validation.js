const Joi = require('joi');

const getProfile = {
  params: Joi.object().keys({
    bubble_id: Joi.string(),
  }),
};

const createProfile = {
  body: Joi.object().keys({
    bubble_id: Joi.string(),
    preferences: Joi.string(),
    min_price: Joi.number(),
    max_price: Joi.number(),
  }),
};

module.exports = {
  getProfile,
  createProfile
};