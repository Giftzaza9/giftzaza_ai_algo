const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Product, AnalysisProduct } = require('../models');
const ApiError = require('../utils/ApiError');
const { scrapeProduct } = require('../lib/scrapeProduct');
const GPTbasedTagging = require('../lib/GPTbasedTagging');
const { amazonUrlCleaner, bloomingdaleUrlCleaner } = require('../utils/urlCleaners');
const axiosInstance = require('../utils/axiosInstance');
const { getRecommendedProducts } = require('../services/profile.service');
const userActivity = require('../models/useractivity.model');
const fs = require('fs').promises;


/**
 * Query for products
 * @param {Object} queryObject - Request-Query object
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (queryObject) => {
  const { sort, search = '', filter = '', page = 1, limit = 12, price_min, price_max, hil, curated, is_active, source = '' } = queryObject;
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
      case 'likes-desc':
        optionsObject.sort = { likes: -1 };
        break;
      case 'likes-asc':
        optionsObject.sort = { likes: 1 };
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
  if (typeof curated === 'boolean' && curated) filterObject.curated = curated;
  if (typeof is_active === 'boolean') filterObject.is_active = is_active;
  if (search) filterObject.title = { $regex: new RegExp(search, 'i') };
  if (filter) filterObject.tags = { $all: filter?.split(',')?.map((el) => (el?.trim() === '65' ? '65 +' : el)) };
  if (source && source?.split(',')?.length == 1) filterObject.source = (source?.split(',')?.[0]?.toLowerCase()) === "bloomingdales" ? {$in: ['bloomingdales', 'bloomingdale']} : source?.split(',')?.[0]?.toLowerCase();

  const [total, products] = await Promise.all([
    Product.count(filterObject),
    Product.aggregate([
      {
        $match: filterObject,
      },
      {
        $lookup: {
          from: 'useractivities',
          localField: '_id',
          foreignField: 'product_id',
          as: 'activities',
        },
      },
      {
        $addFields: {
          likes: {
            $size: {
              $filter: {
                input: '$activities',
                as: 'activity',
                cond: { $eq: ['$$activity.activity', 'like'] },
              },
            },
          },
        },
      },
      {
        $project: {
          activities: 0,
        },
      },
      {
        $sort: optionsObject.sort,
      },
      {
        $skip: (optionsObject.page - 1) * optionsObject.limit,
      },
      {
        $limit: optionsObject.limit,
      },
    ]).collation({ locale: 'en', strength: 2 }),
  ]);
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  return { hasNextPage, totalDocs: total, page, limit, docs: products };
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

  if (!scrapedProduct || !scrapedProduct.title) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found or out of stock');
  }

  const gptData = await GPTbasedTagging(
    scrapedProduct.description || scrapedProduct.features.join('. '),
    scrapedProduct.title
  );
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
  const { preferences, ...rest } = productBody;
  const payload = {
    ...rest,
    new_attributes: preferences,
  };
  console.log({payload});
  return await getRecommendedProducts(payload)
    .then(async (res) => {
            const objectIds = convertToObjectId(res);
            // console.log("OBJECT ID AFTER REC ", objectIds);
            const products = await Product.find({ _id: { $in: objectIds } });
            // console.log("PRODUCTS AFTER RECOMMENDATION ", products);
            const products_detail = objectIds?.map((obj) => {
        const productDetails = products.find((product) => product._id == obj?.item_id);
        return { ...obj, item_id: productDetails };
      }).filter((item) => item.item_id);
      return products_detail;
    })
    .catch((error) => {
      console.log('ERROR IN GET MORE PRODUCTS ', error.message);
      throw new ApiError(httpStatus.BAD_REQUEST, error.message || 'Failed in fetch more products !');
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

  const productsData = products.map((item) => item.product[0]).filter((item) => item);
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
      throw new ApiError(httpStatus.BAD_REQUEST, error.message || 'Failed in product recommendation');
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
    const { title, price, image, link, rating, description, thumbnails, price_currency, features } = await scrapeProduct(product.link);
    console.log({ title, price, image, link, rating, description, thumbnails, price_currency, features })
    product.title = title;
    product.price = price;
    product.image = image;
    product.thumbnails = thumbnails;
    product.description = description;
    product.features = features;
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

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
// For bulk scrape products and upload to mongoDB products collection at once to avoid multiple db writes
const createAnalysisProduct = async (productBody) => {

  const scraped = [];

  try {
    const sleepy = (delay) =>
      new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    let count = 0;

    for await (let link of productBody.product_links) {
      count++;
      if (link.includes('amazon')) link = amazonUrlCleaner(link) || link;
      if (link.includes('bloomingdale')) link = bloomingdaleUrlCleaner(link) || link;
      
      const productDB = await Product.findOne({ link: link });
      if (productDB) {
        console.log(`${count}th failed: Existing product`);
        continue;
      }
      const product_data = await scrapeProduct(link, productBody.userId);
      if (!product_data || !product_data.title || !product_data.image) {
        console.log(`${count}th failed: Scrape error || Product not found or out of stock'`);
        console.log({product_data});
        continue;
      }
      const gptdata = await GPTbasedTagging(product_data.description || product_data.features.join('. '),
      product_data.title);
      if (!gptdata.preferenceData.length) {
        console.log(`${count}th failed: preference data is not available`);
        continue;
      };
      product_data.tags = gptdata.preferenceData;
      product_data.gptTagging = gptdata.JSON_response;
      product_data.curated = false;
      product_data.hil = false;
      scraped.push(product_data);
      console.log(`${count}/${productBody.product_links?.length} scraped, link: ${link}`);
      await sleepy(Math.floor(Math.random() * (2001 - 1000) + 1000));
    }

    // console.log(scraped?.map(p => p.title));
    // if (scraped.length) await AnalysisProduct.create(scraped);
    if (scraped.length) await Product.create(scraped);
    return scraped?.map((p) => p.link);
  } catch (error) {
    console.error(error);
  } finally {
    const jsonData = JSON.stringify(scraped, null, 2);
    await fs.writeFile('output.json', jsonData, 'utf8');
  }
}

const bulkRescrape = async (condition) => {
  console.log('🚀 ~ bulkRescrape ~ condition:', condition)
  const added = [];
  const failed = [];
  const products = await Product.find(condition);
  if (!products.length) throw new Error('No products found !');
  let count = 0;
  for (const product of products) {
    console.log(count++, product?.title);
    try {
      const { title, price, image, link, rating, description, thumbnails, price_currency, features } = await scrapeProduct(
        product.link
      );

      console.log({ title, price });
      if (price === -1) {
        failed.push(product?.link);
        // await Product.findByIdAndUpdate(product._id, { is_active: false });
        continue;
      }

      await Product.findByIdAndUpdate(product._id, {
        title,
        price,
        image,
        thumbnails,
        description,
        features,
        rating,
        link,
        price_currency,
        is_active: true,
      });

      added.push(product?.link);
    } catch (error) {
      failed.push(product?.link);
      console.log(error);
    }
  }

  return { added, failed };
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
  createAnalysisProduct,
  bulkRescrape,
};
