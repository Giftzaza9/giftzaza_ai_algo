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
    },
    image: {
      type: String,
      required: true,
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

const AnalysisProduct = mongoose.model('AnalysisProduct', productSchema);

module.exports = AnalysisProduct;
