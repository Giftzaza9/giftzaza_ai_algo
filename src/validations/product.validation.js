const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getProducts = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    title: Joi.string(),
  }),
};

const createProduct = {
  body: Joi.object().keys({
    product_link: Joi.string(),
    userId: Joi.string().custom(objectId),
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
    tags: Joi.string(),
  }),
};

module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  userActivity,
};
