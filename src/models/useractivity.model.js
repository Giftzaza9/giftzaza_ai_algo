/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const userActivityschema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  userId: {
    type: String,
    ref: 'User',
  },
});

userActivityschema.plugin(toJSON);

const userActivity = mongoose.model('userActivity', userActivityschema);

module.exports = userActivity;
