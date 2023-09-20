const httpStatus = require('http-status');
const { Profile, Product } = require('../models');
const ApiError = require('../utils/ApiError');
const calculateSimilarity = require('../lib/calculateSimilarity')

/**
 * Get profile by id
 * @param {ObjectId} profileId
 * @returns {Promise<Profile>}
 */
const getProfileById = async (profileId) => {
    const profile = await Profile.findById(profileId);
    if(!profile){
      throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
    }
    return profile;
};

/**
 * Create a profile
 * @param {Object} profileBody
 * @returns {Promise<Profile>}
 */
const createProfile = async (profileBody) => {
  const profile = await Profile.create({});
  const products = await Product.find({ price: { $gte: profileBody.min_price, $lte: profileBody.max_price } })

  if(!products){
    throw new ApiError(httpStatus.NOT_FOUND, 'Products not found');
  }

  for (const product of products) {
    product.similarity = calculateSimilarity(profileBody.preferences, product.tags);
  }

  products.sort((a, b) => b.similarity - a.similarity);

  if (products.length > 30) {
    profile.recommended_products = products.slice(0, 30);
  } else {
    profile.recommended_products = products
  }

  await profile.save()
  return profile
};

/**
 * Delete profile by id
 * @param {ObjectId} profileId
 * @returns {Promise<Profile>}
 */
const deleteProfileById = async (profileId) => {
  const profile = await Profile.findById(profileId);
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  await profile.remove();
  return profile;
};


/**
 * Update a profile
 * @param {Object} profile
 * @param {Object} profileBody
 * @returns {Promise<Profile>}
 */
const updateProfile = async (profile, profileBody) => {
  const products = await Product.find({ price: { $gte: profileBody.min_price, $lte: profileBody.max_price } })

  for (const product of products) {
    product.similarity = calculateSimilarity(profileBody.preferences, product.tags);
  }

  products.sort((a, b) => b.similarity - a.similarity);

  if (products.length > 30) {
    profile.recommended_products = products.slice(0, 30);
  } else {
    profile.recommended_products = products
  }

  await profile.save()
  return profile
};


module.exports = {
  getProfileById,
  createProfile,
  deleteProfileById,
  updateProfile
};