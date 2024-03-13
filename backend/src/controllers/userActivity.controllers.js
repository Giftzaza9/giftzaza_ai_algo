/* eslint-disable camelcase */
/* eslint-disable object-shorthand */
/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userActivityService } = require('../services');

const storeUserActivity = catchAsync(async (req, res) => {
  req.body.user_id = req.user._id;
  const activity = await userActivityService.createUserActivity(req.body);
  res.status(httpStatus.OK).send(activity);
});

module.exports = { storeUserActivity };
