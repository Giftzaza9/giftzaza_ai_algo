/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { availableActivities } = require('../variables/constants');

const userActivityschema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    activity: {
      type: String,
      enum: availableActivities,
    },
    profile_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },
  },
  {
    timestamps: true,
  }
);

userActivityschema.plugin(toJSON);

const userActivity = mongoose.model('userActivity', userActivityschema);

module.exports = userActivity;
