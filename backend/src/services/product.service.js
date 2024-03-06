const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const { scrapeProduct } = require('../lib/scrapeProduct');
const GPTbasedTagging = require('../lib/GPTbasedTagging');
const { amazonUrlCleaner, bloomingdaleUrlCleaner } = require('../utils/urlCleaners');

/**
 * Query for products
 * @param {Object} queryObject - Request-Query object
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (queryObject) => {
  const { sort, search = '', filter = '', page = 1, limit = 12 } = queryObject;
  const filterObject = {
    // is_active: true,
    //  hil: true
  };
  const optionsObject = { page, limit, sort: { createdAt: -1 } };
  if (sort) {
    switch (sort) {
      case 'latest':
        optionsObject.sort = { createdAt: -1 };
        break;
      case 'oldest':
        optionsObject.sort = { createdAt: 1 };
        break;
      case 'price-hi-to-lo':
        optionsObject.sort = { price: -1 };
        break;
      case 'price-lo-to-hi':
        optionsObject.sort = { price: 1 };
        break;
      case 'alpha-desc':
        optionsObject.sort = { title: -1 };
        break;
      case 'alpha-asc':
        optionsObject.sort = { title: 1 };
        break;
      default:
        optionsObject.sort = { createdAt: -1 };
    }
  }
  if (search) filterObject.title = { $regex: new RegExp(search, 'i') };
  if (filter) filterObject.tags = { $all: filter?.split(',') };
  return await Product.paginate(filterObject, optionsObject);
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
  const scrapedProduct = await scrapeProduct(product_link, user_id);
  console.log('🚀 ~ scrapeAndAddProduct ~ scrapedProduct:', scrapedProduct)

  if (!scrapedProduct || !scrapedProduct.description) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found or out of stock');
  }

  const gptData = await GPTbasedTagging(scrapedProduct.description);
  scrapedProduct.tags = gptData.preferenceData;
  scrapedProduct.gptTagging = gptData.JSON_response;
  scrapedProduct.curated = false;
  scrapedProduct.hil = false;
  console.log('🚀 ~ scrapeAndAddProduct ~ scrapedProduct:', scrapedProduct)
  const product = productDB
    ? await Product.findByIdAndUpdate(productDB?._id, scrapedProduct, { new: true, useFindAndModify: false })
    : await Product.create(scrapedProduct);
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
  const product = await Product.findByIdAndUpdate(productId, { is_active: false });
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
