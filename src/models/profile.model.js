const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const profileSchema = new mongoose.Schema(
  {
    recommended_products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    profile_preferences: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    occasion: {
      type: String,
    },
    occasion_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

profileSchema.plugin(toJSON);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;