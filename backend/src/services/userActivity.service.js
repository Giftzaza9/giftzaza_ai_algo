const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { UserActivity } = require('../models');

const createUserActivity = async (body) => {
  const { product_id, activity, profile_id, user_id } = body;
  try {
    const activityExists = await UserActivity.findOne({ product_id, user_id, activity, profile_id });
    if (activityExists) return activityExists;
    return await UserActivity.create({
      product_id,
      user_id,
      activity,
      profile_id,
    });
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error?.message || 'Something went wrong!');
  }
};

const getUserActivity = async (userId) => {
  try {
    return await UserActivity.aggregate([
      {
        $match: { activity: 'save', user_id: userId },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'profile_id',
          foreignField: '_id',
          as: 'profile',
        },
      },
      {
        $unwind: '$profile',
      },
      {
        $group: {
          _id: '$profile._id',
          profile: { $first: '$profile' },
          savedProducts: { $push: '$product' },
        },
      },
    ]);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

module.exports = {
  createUserActivity,
  getUserActivity,
};
