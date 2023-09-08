const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { profileService } = require('../services');

const getProfile = catchAsync(async (req, res) => {
  const profile = await profileService.getProfileByBubbleId(req.params.bubble_id);
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  res.send(profile);
});

const createProfile = catchAsync(async (req, res) => {
  const profile = await profileService.createProfile(req.body);
  res.status(httpStatus.CREATED).send(profile);
});

module.exports = {
  getProfile,
  createProfile
};