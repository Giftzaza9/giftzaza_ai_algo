const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getProducts = {
  query: Joi.object().keys({
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
    sort: Joi.string(),
    search: Joi.string(),
    source: Joi.string(),
    filter: Joi.string(),
  }),
};

const scrapeProduct = {
  body: Joi.object().keys({
    product_link: Joi.string(),
  }),
};

const createProduct = {
  body: Joi.object().keys({
    product_id: Joi.string().custom(objectId).required(),
    tags: Joi.array().required(),
    curated: Joi.boolean().default(false),
  }),
};

const userActivity = {
  body: Joi.object().keys({
    productId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
    activity_type: Joi.string(),
    activity_time: Joi.date(),
    profile_id: Joi.string().custom(objectId),
  }),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    tags: Joi.array(),
    curated: Joi.string(),
  }),
};

module.exports = {
  getProducts,
  scrapeProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  userActivity,
};
