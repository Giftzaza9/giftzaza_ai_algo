const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

const getProducts = catchAsync(async (req, res) => {
  const result = await productService.queryProducts(req.query);
  res.send(result);
});

const scrapeProduct = catchAsync(async (req, res) => {
  req.body.user_id = req.user._id;
  const product = await productService.scrapeAndAddProduct(req.body);
  res.status(httpStatus.CREATED).send(product);
});

const scrapeProductLinks = catchAsync(async (req, res) => {
  const links = await productService.scrapeProductLinks(req.body);
  res.status(httpStatus.OK).send(links);
});

const similarProducts = catchAsync(async (req, res) => {
  const products = await productService.similarProducts(req.body);
  res.status(httpStatus.OK).send(products);
});

const moreProducts = catchAsync(async (req, res) => {
  req.body.user_id = req.user._id;
  const products = await productService.getMoreProducts(req.body);
  console.log({products})
  res.status(httpStatus.OK).send(products);
});

const shopping = catchAsync(async (req, res) => {
  const products = await productService.startShopping(req.body);
  res.status(httpStatus.OK).send(products);
});

const createProduct = catchAsync(async (req, res) => {
  req.body.user_id = req.user._id;
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  const product = await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.send(product);
});

const createAnalysisProduct = catchAsync(async (req, res) => {
  req.body.userId = req.user._id;
  const product = await productService.createAnalysisProduct(req.body);
  res.status(httpStatus.CREATED).send(product);
});

const bulkRescrape = catchAsync(async (req, res) => {
  const result = await productService.bulkRescrape(req.body);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  getProducts,
  scrapeProduct,
  similarProducts,
  moreProducts,
  shopping,
  createProduct,
  deleteProduct,
  updateProduct,
  createAnalysisProduct,
  bulkRescrape,
  scrapeProductLinks,
};
