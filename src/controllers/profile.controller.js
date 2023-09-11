const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { profileService } = require('../services');

const getProfile = catchAsync(async (req, res) => {
  const profile = await profileService.getProfileById(req.params.profileId);
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  res.send(profile);
});

const createProfile = catchAsync(async (req, res) => {
  req.body.preferences = JSON.parse(req.body.preferences)
  const profile = await profileService.createProfile(req.body);
  res.status(httpStatus.CREATED).send(profile);
});

const deleteProfile = catchAsync(async (req, res) => {
  await profileService.deleteProfileById(req.params.profileId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getProfile,
  createProfile,
  deleteProfile
};