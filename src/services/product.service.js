const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const { scrapeProduct } = require('../lib/scrapeProduct');
const classificateProduct = require('../lib/classificateProduct');
const rulebasedTagging = require('../lib/rulebasedTagging');
const GPTbasedTagging = require('../lib/GPTbasedTagging');

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
  return await Product.paginate(filter, options);
};

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  const productDB = await Product.findOne({ link: productBody.product_link });
  if (productDB) {
    return productDB;
  }

  const product_data = await scrapeProduct(productBody.product_link, productBody.userId);

  if (!product_data || !product_data.description) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found or out of stock');
  }
  const gptdata = await GPTbasedTagging(product_data.description);
  product_data.tags = gptdata.preferenceData;
  product_data.gptTagging = gptdata.JSON_response;
  product_data.curated = false;
  const product = await Product.create(product_data);
  await product.save();
    return product;
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await Product.findById(productId);
  const product_data = await scrapeProduct(product.link);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  product.tags = updateBody.tags;
  product.title = product_data.title;
  product.price = product_data.price;
  product.image = product_data.image;
  product.curated = updateBody.curated ? true : false;
  product.description = product_data.description;
  product.rating = product_data.rating;
  await product.save();
  return product;
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.remove();
  return product;
};

module.exports = {
  queryProducts,
  createProduct,
  deleteProductById,
  updateProductById,
};
