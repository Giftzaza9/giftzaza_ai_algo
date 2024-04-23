const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { rightsEnum } = require('../../config/roles');
const { errorLogValidation } = require('../../validations');
const { errorLogController } = require('../../controllers');

const router = express.Router();

router
  .route('/:id')
  .get(auth(rightsEnum.MANAGE_ERROR), validate(errorLogValidation.getErrorLog), errorLogController.getErrorLog)
  .delete(auth(rightsEnum.MANAGE_ERROR), validate(errorLogValidation.deleteErrorLog), errorLogController.deleteErrorLog);

router
  .route('/')
  .get(auth(rightsEnum.MANAGE_ERROR), validate(errorLogValidation.getErrorLogs), errorLogController.getErrorLogs)
  .post(auth(), validate(errorLogValidation.createErrorLog), errorLogController.createErrorLog);

module.exports = router;
