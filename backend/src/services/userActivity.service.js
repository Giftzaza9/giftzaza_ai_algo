const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const userActivity = require('../models/useractivity.model');
const activityEmitter = require('../lib/FbEventTracker');
const { productService } = require('.');

const createUserActivity = async (body, user, ip) => {
  const { product_id, activity, profile_id, user_id } = body;
  try {
    const activityExists = await userActivity.findOne({ product_id, user_id, activity, profile_id });
    if (activityExists) return activityExists;

    const newUserActivity = await userActivity.create({
      product_id,
      user_id,
      activity,
      profile_id,
    });

    if (['like', 'dislike', 'buy'].includes(activity)) {
      try {
        const product = await productService.getProductById(product_id);
        activityEmitter.emitCardEvent(newUserActivity, user, product, ip);
      } catch (error) {
        console.log(error);
      }
    }

    return newUserActivity;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error?.message || 'Something went wrong!');
  }
};

const deleteSavedProduct = async (body, user_id) => {
  try {
    const { product_id, profile_id } = body;
    const activity = await userActivity.findOne({ product_id, user_id, profile_id, activity: 'save' });
    if (!activity) throw new ApiError(httpStatus.NOT_FOUND, 'Activity not found');
    return await activity.remove();
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error?.message || 'Something went wrong!');
  }
};

const getSavedProducts = async (userId) => {
  try {
    return await userActivity.aggregate([
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
          profile_id: { $first: '$profile._id' },
          profile_title: { $first: '$profile.title' },
          savedProducts: { $push: '$product' },
          updatedAt: { $first: '$profile.updatedAt' },
        },
      },
      {
        $project: {
          profile_id: 1,
          profile_title: 1,
          savedProducts: {
            $reduce: {
              input: '$savedProducts',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this'] },
            },
          },
          updatedAt: 1,
        },
      },
      {
        $match: {
          savedProducts: { $ne: [] },
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
    ]);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

module.exports = {
  createUserActivity,
  getSavedProducts,
  deleteSavedProduct,
};
