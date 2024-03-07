const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

// Schema for RecommendedProduct
const recommendedProductSchema = new mongoose.Schema({
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  title: String,
  tags: [String],
  matching_score: Number,
});

const profileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    age: {
      type: String,
    },
    gender: {
      type: String,
    },
    relation: {
      type: String,
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
    styles: [
      {
        type: String,
      },
    ],
    interests: [
      {
        type: String,
      },
    ],
    preferences: [
      {
        type: String,
      },
    ],
    profile_preferences: {
      type: Object,
    },
    recommended_products: [recommendedProductSchema],
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
