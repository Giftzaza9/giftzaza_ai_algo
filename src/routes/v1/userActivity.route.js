/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
const express = require('express');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const { validateApiKey } = require('../../middlewares/apiKey');
const { userActivityController } = require('../../controllers');
const router = express.Router();

router.route('/').post(validateApiKey, validate(productValidation.userActivity), userActivityController.getUserClick);

module.exports = router;
