/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const userActivityschema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  activity_type: {
    type: String,
  },
  activity_time: {
    "type": Date, 
    "default": Date.now 
  },
  profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  },

});

userActivityschema.plugin(toJSON);

const userActivity = mongoose.model('userActivity', userActivityschema);

module.exports = userActivity;
