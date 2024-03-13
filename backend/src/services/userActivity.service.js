const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { userActivity } = require('../models');

const createUserActivity = async (body) => {
  const { product_id, activity, profile_id, user_id } = body;
  try {
    return await userActivity.create({
      product_id,
      user_id,
      activity,
      profile_id,
    });
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

module.exports = {
  createUserActivity,
};
