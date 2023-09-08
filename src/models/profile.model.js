const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const profileSchema = new mongoose.Schema({
  bubble_id: {
    type: String,
    required: true,
  },
  preferences: [String],
  recommended_products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

profileSchema.plugin(toJSON);

/**
 * Check if bubble_id is taken
 * @param {string} bubble_id - The profile bubble_id
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
profileSchema.statics.isRegistered = async function (bubble_id, excludeUserId) {
  const profile = await this.findOne({ bubble_id, _id: { $ne: excludeUserId } });
  return !!profile;
};

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;