const pick = require('../utils/pick');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

const getProducts = catchAsync(async (req, res) => {
  const filter = { title: new RegExp(req.query.title, 'i') }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts(filter, options);
  console.log(result)
  res.send(result);
});

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateProduct = catchAsync(async (req, res) => {
  req.body.tags = JSON.parse(req.body.tags)
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.send(product);
});

module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct
};