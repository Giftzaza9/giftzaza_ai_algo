const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userActivityService } = require('../services');

const createUserActivity = catchAsync(async (req, res) => {
  req.body.user_id = req.user._id;
  const activity = await userActivityService.createUserActivity(req.body, req.user);
  res.status(httpStatus.OK).send(activity);
});

const getSavedProducts = catchAsync(async (req, res) => {
  const activity = await userActivityService.getSavedProducts(req.user._id);
  res.status(httpStatus.OK).send(activity);
});

const removeSavedProduct = catchAsync(async (req, res) => {
  const activity = await userActivityService.deleteSavedProduct(req.body, req.user._id);
  res.status(httpStatus.OK).send(activity);
});

module.exports = { createUserActivity, getSavedProducts, removeSavedProduct };
