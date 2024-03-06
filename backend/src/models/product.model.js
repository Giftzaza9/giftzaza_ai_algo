const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const { toJSON } = require('./plugins');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
    },
    thumbnails: {
      type: [String]
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [String],
    similarity: {
      type: Number,
      default: 0,
    },
    rulebased_tags: [],
    gptTagging: [],
    price_currency: {
      type: String,
    },
    curated: {
      type: Boolean,
    },
    hil: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
