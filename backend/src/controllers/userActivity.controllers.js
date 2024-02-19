/* eslint-disable camelcase */
/* eslint-disable object-shorthand */
/* eslint-disable prettier/prettier */
const catchAsync = require('../utils/catchAsync');
const { userActivity } = require('../models');

const getUserClick = catchAsync(async (req, res) => {
  const { productId, activity_type, profile_id, userId } = req.body;
  try {
    if ((productId, userId)) {
      userActivity.create({
        productId,
        user_id: userId,
        activity_type,
        profile_id
      });
      res.status(200).send('user activity captured');
    } else {
      res.status(202).send('productId or userId missing');
    }
  } catch (error) {
    res.status(202).send('something went wrong');
  }
});

module.exports = { getUserClick };
