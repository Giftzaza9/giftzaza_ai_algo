const express = require('express');
const validate = require('../../middlewares/validate');
const profileValidation = require('../../validations/profile.validation');
const profileController = require('../../controllers/profile.controller');
const auth = require('../../middlewares/auth');
const { rightsEnum } = require('../../config/roles');

const router = express.Router();

router
  .route('/:profileId')
  .get(auth(rightsEnum.MANAGE_PROFILE), validate(profileValidation.getProfile), profileController.getProfile)
  .patch(auth(rightsEnum.MANAGE_PROFILE), validate(profileValidation.updateProfile), profileController.updateProfile)
  .delete(auth(rightsEnum.MANAGE_PROFILE), validate(profileValidation.deleteProfile), profileController.deleteProfile)

router
  .route('/')
  .get(auth(rightsEnum.MANAGE_PROFILE), validate(profileValidation.getProfiles), profileController.getProfiles)
  .post(auth(rightsEnum.MANAGE_PROFILE), validate(profileValidation.createProfile), profileController.createProfile)

module.exports = router;