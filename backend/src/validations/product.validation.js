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
    price_min: Joi.number().integer(),
    price_max: Joi.number().integer(),
    hil: Joi.boolean(),
    is_active: Joi.boolean()
  }),
};

const scrapeProduct = {
  body: Joi.object().keys({
    product_link: Joi.string(),
  }),
};

const similarProducts = {
  body: Joi.object().keys({
    item_id: Joi.string(),
    top_n: Joi.number().integer()
  }),
};

const moreProducts = {
  body: Joi.object().keys({
    preferences: Joi.array().required(),
    top_n: Joi.number().integer()
  }),
};

const createProduct = {
  body: Joi.object().keys({
    product_id: Joi.string().custom(objectId).required(),
    tags: Joi.array().required(),
    curated: Joi.boolean().default(false),
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
    curated: Joi.boolean(),
    scrape: Joi.boolean().default(false),
  }),
};

module.exports = {
  getProducts,
  scrapeProduct,
  similarProducts,
  moreProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};
