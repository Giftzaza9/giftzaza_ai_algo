const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const profileSchema = new mongoose.Schema({
  recommended_products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

profileSchema.plugin(toJSON);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;