const express = require('express');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router
  .route('/:productId')
  .delete(validate(productValidation.deleteProduct), productController.deleteProduct)
  .patch(validate(productValidation.updateProduct), productController.updateProduct)

router
  .route('/')
  .get(validate(productValidation.getProducts), productController.getProducts)
  .post(validate(productValidation.createProduct), productController.createProduct)

module.exports = router;