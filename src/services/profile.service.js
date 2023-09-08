const httpStatus = require('http-status');
const { Profile, Product } = require('../models');
const ApiError = require('../utils/ApiError');
const jaccardSimilarity = require('../lib/jaccardSimilarity')

/**
 * Get profile by id
 * @param {String} bubble_id
 * @returns {Promise<Profile>}
 */
const getProfileByBubbleId = async (id) => {
  return Profile.find({ bubble_id: id }).populate("recommended_products").exec();
};

/**
 * Create a profile
 * @param {Object} profileBody
 * @returns {Promise<Profile>}
 */
const createProfile = async (profileBody) => {
  profileBody.preferences = JSON.parse(profileBody.preferences)
  if (await Profile.isRegistered(profileBody.bubble_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile already exists');
  }
  const profile = await Profile.create(profileBody);
  const products = await Product.find({ price: { $gte: profileBody.min_price, $lte: profileBody.max_price } })

  for (const product of products) {
    product.similarity = jaccardSimilarity(product.categories, profile.preferences);
  }

  // Ordena el array en función del valor de la propiedad 'numero' de forma descendente.
  products.sort((a, b) => b.similarity - a.similarity);

  if (products.length > 30) {
    profile.recommended_products = products.slice(0, 30);
  } else {
    profile.recommended_products = products
  }

  return profile.save()
};

module.exports = {
  getProfileByBubbleId,
  createProfile
};