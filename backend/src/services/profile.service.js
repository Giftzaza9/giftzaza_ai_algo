const httpStatus = require('http-status');
const { Profile, Product } = require('../models');
const ApiError = require('../utils/ApiError');
const calculateSimilarity = require('../lib/calculateSimilarity');
const axiosInstance = require('../utils/axiosInstance');
const { isAxiosError } = require('axios');

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
  profile.recommended_products = profile.recommended_products?.filter(recommendedProduct => recommendedProduct?.item_id?.is_active);
  return profile;
};

const queryProfiles = async (user_id, is_shopping_profile) => {
  const payload = !!is_shopping_profile ? { is_shopping_profile: true, user_id } : { user_id };
  return await Profile.find(payload).sort({ createdAt: -1 });
};

const getRecommendedProducts = async (payload) => {
  console.log('PAYLOAD ', payload);
  try {
    const { data, status } = await axiosInstance.post(`/create_recommendation`, payload);
    console.log('RESPONSEE ', data);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log('ERR', error);
      console.log('RES', error?.response);
      console.log('MSG', error?.response?.message);
      console.log('DAT', error?.response?.data);
      console.log('DTL', error?.response?.data?.detail);
    }
    console.log('ERROR IN RECOMMENDATION MSG ', error.message);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed in product recommendation');
  }
};

/**
 * Create a profile
 * @param {Object} profileBody
 * @returns {Promise<Profile>}
 */
const createProfile = async (profileBody) => {
  const profile_preferences = {
    gender: [profileBody.gender],
    age: [profileBody.age],
    relation: [profileBody.relation],
    occasion: profileBody?.occasion ? [profileBody.occasion] : [],
    styles: profileBody.styles,
    interests: profileBody?.interests,
  };
  const preferences = Object.values(profile_preferences)
    .flat()
    .filter((item) => item !== undefined)
    .map((item) => item.toLowerCase());

  profileBody.profile_preferences = profile_preferences;
  profileBody.preferences = preferences;

  const semi_hard_filters = [];
  if (profileBody.styles?.length) semi_hard_filters.push('style');
  if (profileBody.interests?.length) semi_hard_filters.push('interest');
  
  const payload = {
    user_id: profileBody?.user_id,
    new_attributes: profileBody?.interests?.length ? preferences : [...preferences, 'spirituality'],
    top_n: 10,
    min_price: profileBody?.min_price,
    max_price: profileBody?.max_price,
    semi_hard_filters: semi_hard_filters,
  };
  try {
    profileBody.recommended_products = await getRecommendedProducts(payload);
    return await Profile.create(profileBody);
  } catch (err) {
    console.log('ERROR IN RECOMMENDATION RES ', err);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
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
  const profile_preferences = {
    gender: [profileBody.gender],
    age: [profileBody.age],
    relation: [profileBody.relation],
    occasion: profileBody?.occasion ? [profileBody.occasion] : [],
    styles: profileBody.styles,
    interests: profileBody?.interests,
  };
  const preferences = Object.values(profile_preferences)
    .flat()
    .filter((item) => item !== undefined)
    .map((item) => item.toLowerCase());

  profileBody.profile_preferences = profile_preferences;
  profileBody.preferences = preferences;

  const semi_hard_filters = [];
  if (profileBody.styles?.length) semi_hard_filters.push('style');
  if (profileBody.interests?.length) semi_hard_filters.push('interest');

  const payload = {
    user_id: profileBody?.user_id,
    new_attributes: profileBody?.interests?.length ? preferences : [...preferences, 'spirituality'],
    top_n: 10,
    min_price: profileBody?.min_price,
    max_price: profileBody?.max_price,
    semi_hard_filters: [],
  };
  try {
    profileBody.recommended_products = await getRecommendedProducts(payload);
    return await Profile.findByIdAndUpdate(profileId, profileBody, {
      new: true,
      useFindAndModify: false,
      populate: 'recommended_products.item_id',
    });
  } catch (err) {
    console.log('ERROR IN RECOMMENDATION RES ', err);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

module.exports = {
  getProfileById,
  queryProfiles,
  createProfile,
  deleteProfileById,
  updateProfile,
  getRecommendedProducts,
};
