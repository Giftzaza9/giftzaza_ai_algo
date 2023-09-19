const Joi = require('joi');

const getProfile = {
  params: Joi.object().keys({
    profileId: Joi.string(),
  }),
};

const deleteProfile = {
  params: Joi.object().keys({
    profileId: Joi.string(),
  }),
};

const createProfile = {
  body: Joi.object().keys({
    preferences: Joi.string(),
    min_price: Joi.number(),
    max_price: Joi.number(),
  }),
};

const updateProfile = {
  body: Joi.object().keys({
    profileId: Joi.string(),
    preferences: Joi.string(),
    min_price: Joi.number(),
    max_price: Joi.number(),
  }),
};


module.exports = {
  getProfile,
  createProfile,
  deleteProfile,
  updateProfile
};