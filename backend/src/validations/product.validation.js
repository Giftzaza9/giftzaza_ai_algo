const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getProducts = {
  query: Joi.object().keys({
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
    sort: Joi.string(),
    search: Joi.string(),
    source: Joi.string(),
    curated: Joi.boolean(),
    curated_by: Joi.string().custom(objectId),
    filter: Joi.string(),
    price_min: Joi.number().integer(),
    price_max: Joi.number().integer(),
    uploaded_from: Joi.string(),
    uploaded_until: Joi.string(),
    hil: Joi.boolean(),
    is_active: Joi.boolean()
  }),
};

const scrapeProduct = {
  body: Joi.object().keys({
    product_link: Joi.string(),
  }),
};

const scrapeProductLink = {
  body: Joi.object().keys({
    link: Joi.string().required(),
  }),
};

const bulkRescrape = {
  body: Joi.object().required(),
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
    top_n: Joi.number().integer(),
    min_price: Joi.number(),
    max_price: Joi.number(),
    semi_hard_filters: Joi.array(),
  }),
};

const shopping = {
  body: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number()
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

const createAnalysisProduct = {
  body: Joi.object().keys({
    product_links: Joi.array(),
  }),
};

module.exports = {
  getProducts,
  scrapeProduct,
  similarProducts,
  moreProducts,
  shopping,
  createProduct,
  deleteProduct,
  updateProduct,
  createAnalysisProduct,
  bulkRescrape,
  scrapeProductLink,
};
