/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
const express = require('express');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const { validateApiKey } = require('../../middlewares/apiKey');
const { userActivityController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const router = express.Router();
const { rightsEnum } = require('../../config/roles');
const { userActivityValidation } = require('../../validations');

router
  .route('/')
  .get(auth(), userActivityController.getUserActivity)
  .post(
    auth(rightsEnum.MANAGE_USERS),
    validate(userActivityValidation.createUserActivity),
    userActivityController.createUserActivity
  );

module.exports = router;
