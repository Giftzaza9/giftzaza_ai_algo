const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const profileSchema = new mongoose.Schema(
  {
    title: {
      type : String,
    },
    age: {
      type : String,
    },
    gender: {
      type : String,
    },
    relation: {
      type : String,
    },
    occasion: {
      type: String,
    },
    occasion_date: {
      type: Date,
    },
    min_price: {
      type: Number,
    },
    max_price: {
      type: Number,
    },
    styles: [{
      type : String,
    }],
    interests: [{
      type : String,
    }],
    preferences: [{
      type : String,
    }],
    profile_preferences: {
      type : Object,
    },
    recommended_products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

profileSchema.plugin(toJSON);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;