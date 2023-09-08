const express = require('express');
const validate = require('../../middlewares/validate');
const profileValidation = require('../../validations/profile.validation');
const profileController = require('../../controllers/profile.controller');

const router = express.Router();

router
router
  .route('/:bubble_id')
  .get(validate(profileValidation.getProfile), profileController.getProfile)

router
router
  .route('/')
  .post(validate(profileValidation.createProfile), profileController.createProfile)

module.exports = router;