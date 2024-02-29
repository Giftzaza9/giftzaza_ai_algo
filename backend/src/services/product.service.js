const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const { scrapeProduct } = require('../lib/scrapeProduct');
const classificateProduct = require('../lib/classificateProduct');
const rulebasedTagging = require('../lib/rulebasedTagging');
const GPTbasedTagging = require('../lib/GPTbasedTagging');
const { amazonUrlCleaner, bloomingdaleUrlCleaner } = require('../utils/urlCleaners');

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
 * Scrape the product from link, and saves to the database
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const scrapeAndAddProduct = async (productBody) => {
  let { product_link, user_id } = productBody;

  if (product_link.includes('amazon')) product_link = amazonUrlCleaner(product_link) || product_link;
  if (product_link.includes('bloomingdale')) product_link = bloomingdaleUrlCleaner(product_link) || product_link;
  
  const productDB = await Product.findOne({ link: product_link });
  const product_data = await scrapeProduct(product_link, user_id);

  if (!product_data || !product_data.description) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found or out of stock');
  }

  const gptData = await GPTbasedTagging(product_data.description);
  product_data.tags = gptData.preferenceData;
  product_data.gptTagging = gptData.JSON_response;
  product_data.curated = false;
  product_data.hil = false;
  const product = productDB
    ? await Product.findByIdAndUpdate(productDB?._id, product_data, { new: true, useFindAndModify: false })
    : await Product.create(product_data);
  return product;
};

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  const { product_id, tags, curated } = productBody;

  let product = await Product.findById(product_id);
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found !');

  product = await Product.findByIdAndUpdate(
    product_id,
    {
      tags: tags,
      curated: !!curated,
      hil: true,
    },
    { new: true, useFindAndModify: false }
  );

  return product;
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {

  const { tags, curated } = updateBody;
  const product = await Product.findById(productId);
  const product_data = await scrapeProduct(product.link);
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  
  product.tags = tags;
  product.title = product_data.title;
  product.price = product_data.price;
  product.image = product_data.image;
  if (curated !== undefined) product.curated = !!curated;
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
  const product = await Product.findByIdAndDelete(productId);
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  return product;
};

module.exports = {
  queryProducts,
  scrapeAndAddProduct,
  createProduct,
  deleteProductById,
  updateProductById,
};
