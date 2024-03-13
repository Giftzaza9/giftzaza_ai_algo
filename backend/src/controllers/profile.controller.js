const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { profileService } = require('../services');
const { Profile } = require('../models');

const getProfile = catchAsync(async (req, res) => {
  const profile = await profileService.getProfileById(req.params.profileId);
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  res.send(profile);
});

const getProfiles = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  console.log({options});
  const result = await profileService.queryProfiles(options);
  res.send(result);
});

const createProfile = catchAsync(async (req, res) => {
  req.body.user_id = req.user._id;
  const profile = await profileService.createProfile(req.body);
  res.status(httpStatus.CREATED).send(profile);
});

const deleteProfile = catchAsync(async (req, res) => {
  await profileService.deleteProfileById(req.params.profileId);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateProfile = catchAsync(async (req, res) => {
  req.body.user_id = req.user._id;
  let profile = await Profile.findById(req.params.profileId);
  if (!profile || profile.user_id?.toString() !== req.user._id.toString()) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  profile = await profileService.updateProfile(req.body, req.params.profileId);
  res.status(httpStatus.CREATED).send(profile);
});

module.exports = {
  getProfile,
  getProfiles,
  createProfile,
  deleteProfile,
  updateProfile,
};
