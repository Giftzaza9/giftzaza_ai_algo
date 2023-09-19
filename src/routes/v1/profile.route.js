const express = require('express');
const validate = require('../../middlewares/validate');
const profileValidation = require('../../validations/profile.validation');
const profileController = require('../../controllers/profile.controller');

const router = express.Router();

router
  .route('/:profileId')
  .get(validate(profileValidation.getProfile), profileController.getProfile)
  .patch(validate(profileValidation.updateProfile), profileController.updateProfile)
  .delete(validate(profileValidation.deleteProfile), profileController.deleteProfile)

router
  .route('/')
  .post(validate(profileValidation.createProfile), profileController.createProfile)

module.exports = router;