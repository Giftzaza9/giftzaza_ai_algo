const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getProfile = {
  params: Joi.object().keys({
    profileId: Joi.string(),
  }),
};

const getProfiles = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteProfile = {
  params: Joi.object().keys({
    profileId: Joi.string(),
  }),
};

const createProfile = {
  body: Joi.object().keys({
    title: Joi.string(),
    age: Joi.string(),
    gender: Joi.string(),
    relation: Joi.string(),
    occasion: Joi.string(),
    occasion_date: Joi.date(),
    min_price: Joi.number(),
    max_price: Joi.number(),
    styles: Joi.array(),
    interests: Joi.array(),
  }),
};

const updateProfile = {
  body: Joi.object().keys({
    title: Joi.string(),
    age: Joi.string(),
    gender: Joi.string(),
    relation: Joi.string(),
    occasion: Joi.string(),
    occasion_date: Joi.date(),
    min_price: Joi.number(),
    max_price: Joi.number(),
    styles: Joi.array(),
    interests: Joi.array(),
  }),
};

module.exports = {
  getProfile,
  getProfiles,
  createProfile,
  deleteProfile,
  updateProfile,
};
