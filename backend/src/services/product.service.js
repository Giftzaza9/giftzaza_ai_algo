const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const { scrapeProduct } = require('../lib/scrapeProduct');
const GPTbasedTagging = require('../lib/GPTbasedTagging');
const { amazonUrlCleaner, bloomingdaleUrlCleaner } = require('../utils/urlCleaners');
const axiosInstance = require('../utils/axiosInstance');
const { getRecommendedProducts } = require('../services/profile.service');
const userActivity = require('../models/useractivity.model');

/**
 * Query for products
 * @param {Object} queryObject - Request-Query object
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (queryObject) => {
  const { sort, search = '', filter = '', page = 1, limit = 12, price_min, price_max, hil, is_active } = queryObject;
  let filterObject = {
    is_active: true,
    // hil: true,
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
  if (typeof price_min === 'number' && typeof price_max === 'number')
    filterObject = { ...filterObject, $and: [{ price: { $gte: price_min } }, { price: { $lte: price_max } }] };
  else if (typeof price_min === 'number') filterObject.price = { $gte: price_min };
  else if (typeof price_max === 'number') filterObject.price = { $lte: price_max };
  if (typeof hil === 'boolean') filterObject.hil = hil;
  if (typeof is_active === 'boolean') filterObject.is_active = is_active;
  if (search) filterObject.title = { $regex: new RegExp(search, 'i') };
  if (filter) filterObject.tags = { $all: filter?.split(',')?.map((el) => (el?.trim() === '65' ? '65 +' : el)) };
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

  if (!scrapedProduct || !scrapedProduct.title || !scrapedProduct.description) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found or out of stock');
  }

  const gptData = await GPTbasedTagging(scrapedProduct.description, scrapedProduct.title);
  scrapedProduct.tags = gptData.preferenceData;
  scrapedProduct.gptTagging = gptData.JSON_response;
  scrapedProduct.curated = false;
  scrapedProduct.hil = false;
  const product = productDB
    ? await Product.findByIdAndUpdate(productDB?._id, scrapedProduct, { new: true, useFindAndModify: false })
    : await Product.create(scrapedProduct);
  return product;
};

function convertToObjectId(itemIds) {
  // console.log({ itemIds });
  return itemIds?.map((item) => ({
    ...item,
    _id: mongoose.Types.ObjectId(item.item_id),
  }));
}

/**
 * Find get more products
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const getMoreProducts = async (productBody) => {
  const { user_id, preferences, top_n, min_price, max_price } = productBody;
  const payload = {
    user_id,
    new_attributes: preferences,
    top_n,
    min_price,
    max_price,
  };
  return await getRecommendedProducts(payload)
    .then(async (res) => {
      const objectIds = convertToObjectId(res);
      const products = await Product.find({ _id: { $in: objectIds } });
      const products_detail = objectIds?.map((obj) => {
        const productDetails = products.find((product) => product._id == obj?.item_id);
        return { ...obj, item_id: productDetails };
      });
      return products_detail;
    })
    .catch((error) => {
      console.log('ERROR IN GET MORE PRODUCTS ', error.message);
      throw new ApiError(httpStatus.BAD_REQUEST, error.message || 'Faild in fetch more products !');
    });
};

/**
 * Start Shopping
 * @param {Object}
 * @returns {Promise<Product>}
 */
const startShopping = async (payload) => {
  const { page, limit } = payload;
  const products = await userActivity.aggregate([
    {
      $group: {
        _id: '$product_id',
        like: { $sum: { $cond: [{ $eq: ['$activity', 'like'] }, 1, 0] } },
        dislike: { $sum: { $cond: [{ $eq: ['$activity', 'dislike'] }, 1, 0] } },
        buy: { $sum: { $cond: [{ $eq: ['$activity', 'buy'] }, 1, 0] } },
        save: { $sum: { $cond: [{ $eq: ['$activity', 'save'] }, 1, 0] } },
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ['$dislike', -1] },
            { $multiply: ['$like', 2] },
            { $multiply: ['$buy', 4] },
            { $multiply: ['$save', 3] },
          ],
        },
      },
    },

    { $sort: { score: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    {
      $project: {
        product: 1,
        _id: 0,
      },
    },
  ]);
  const productsData = products.map((item) => item.product[0]);
  const totalRows = await userActivity.aggregate([{ $group: { _id: '$product_id', totalRows: { $sum: 1 } } }]);

  const result = {
    row: productsData.length,
    total_rows: totalRows?.length,
    data: productsData,
  };
  return result;
};

/**
 * Find similar products
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const similarProducts = async (productBody) => {
  return await axiosInstance
    .post(`/get_similar_item`, productBody)
    .then(async (res) => {
      const objectIds = convertToObjectId(res?.data);
      // console.log("objectIds ", objectIds)
      const products = await Product.find({ _id: { $in: objectIds } });
      // console.log({products});

      const products_detail = objectIds.map((obj) => {
        const productDetails = products.find((product) => product._id == obj?.item_id);
        return { ...obj, item_id: productDetails };
      });
      // console.log({products_detail})
      return products_detail;
    })
    .catch((error) => {
      console.log('ERROR IN RECOMMENDATION MSG ', error.message);
      throw new ApiError(httpStatus.BAD_REQUEST, error.message || 'Faild in product recommendation');
    });
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

  try {
    axiosInstance.post(`/model_retrain`, {});
  } catch (e) {
    console.error(e);
  }

  return product;
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const { tags, curated, scrape } = updateBody;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

  // From User
  product.tags = tags;
  if (curated !== undefined) product.curated = !!curated;
  product.hil = true;

  // From scraping
  if (scrape) {
    const { title, price, image, link, rating, description, thumbnails, price_currency } = await scrapeProduct(product.link);
    product.title = title;
    product.price = price;
    product.image = image;
    product.thumbnails = thumbnails;
    product.description = description;
    product.rating = rating;
    product.link = link;
    product.price_currency = price_currency;
  }

  await product.save();

  try {
    axiosInstance.post(`/model_retrain`, {});
  } catch (e) {
    console.error(e);
  }

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

  try {
    axiosInstance.post(`/model_retrain`, {});
  } catch (e) {
    console.error(e);
  }

  return product;
};

module.exports = {
  queryProducts,
  scrapeAndAddProduct,
  similarProducts,
  getMoreProducts,
  startShopping,
  createProduct,
  deleteProductById,
  updateProductById,
};
