const httpStatus = require('http-status');
const { Profile, Product } = require('../models');
const ApiError = require('../utils/ApiError');
const calculateSimilarity = require('../lib/calculateSimilarity');
const axiosInstance = require('../utils/axiosInstance');

/**
 * Get profile by id
 * @param {ObjectId} profileId
 * @returns {Promise<Profile>}
 */
const getProfileById = async (profileId) => {
  const profile = await Profile.findById(profileId).populate('recommended_products.item_id');
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  // console.log(profile.recommended_products)
  // await profile.recommended_products.forEach(recommendedProduct => {
  //   recommendedProduct.product = {...recommendedProduct.item_id};
  //   delete recommendedProduct.item_id;
  // });
  return profile;
};

const queryProfiles = async (options) => {
  return await Product.paginate(options);
};

const getRecommendedProducts = async (payload) => {
  console.log('PAYLOAD ', payload);
  try {
    const { data, status } = await axiosInstance.post(`/create_recommendation`, payload);
    console.log('RESPONSEE ', data, status);
    return { data, status, error: null };
  } catch (error) {
    console.log('ERROR IN RECOMMENDATION ', error);
    return console.log('ERROR IN RECOMMENDATION MSG ', error.message);
  }
};

/**
 * Create a profile
 * @param {Object} profileBody
 * @returns {Promise<Profile>}
 */
const createProfile = async (profileBody) => {
  // const profile = await Profile.create({});
  const profile_preferences = {
    gender: [profileBody.gender],
    age: [profileBody.age],
    relation: [profileBody.relation],
    occasion: [profileBody.occasion],
    styles: profileBody.styles,
    interests: profileBody.interests,
  };
  // console.log({profile_preferences})
  const preferences = Object.values(profile_preferences)
    .flat()
    .filter((item) => item !== undefined);
  profileBody.profile_preferences = profile_preferences;
  profileBody.preferences = preferences;
  const payload = {
    user_id: profileBody?.user_id,
    new_attributes: preferences,
    top_n: 10,
  };
  try {
    profileBody.recommended_products = await getRecommendedProducts(payload);
  } catch (err) {
    return console.log('ERROR IN RECOMMENDATION RES ', err);
    return err;
  }
  console.log({ profileBody });
  return await Profile.create(profileBody);

  // await profile.save();
  // return profile;
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
const updateProfile = async (profileBody, profileId) => {
  // const products = await Product.find({ price: { $gte: profileBody.min_price, $lte: profileBody.max_price } });

  // for (const product of products) {
  //   product.similarity = await calculateSimilarity(profileBody.preferences, product.tags);
  // }

  // products.sort((a, b) => b.similarity - a.similarity);

  // if (products.length > 30) {
  //   profile.recommended_products = products.slice(0, 30);
  // } else {
  //   profile.recommended_products = products;
  // }
  const profile_preferences = {
    gender: [profileBody.gender],
    age: [profileBody.age],
    relation: [profileBody.relation],
    occasion: [profileBody.occasion],
    styles: profileBody.styles,
    interests: profileBody.interests,
  };
  const preferences = Object.values(profile_preferences)
    .flat()
    .filter((item) => item !== undefined);
  profileBody.profile_preferences = profile_preferences;
  profileBody.preferences = preferences;

  return await Profile.findOneAndUpdate({ _id: profileId }, profileBody, { new: true });
};

module.exports = {
  getProfileById,
  queryProfiles,
  createProfile,
  deleteProfileById,
  updateProfile,
};
