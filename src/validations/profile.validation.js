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
    gender: Joi.string(),
    relationship: Joi.string(),
    Occassion: Joi.string(),
  }),
};

const updateProfile = {
  body: Joi.object().keys({
    profileId: Joi.string(),
    preferences: Joi.string(),
    min_price: Joi.number(),
    max_price: Joi.number(),
    gender: Joi.string(),
    relationship: Joi.string(),
    Occassion: Joi.string(),
  }),
};


module.exports = {
  getProfile,
  createProfile,
  deleteProfile,
  updateProfile
};
