const express = require('express');
const auth = require('../../middlewares/auth');
const { validateAdmin } = require('../../validations/user.validation');
const { generateApiKey } = require('../../middlewares/apiKey');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();

router.route('/apiKey').post(
  auth('apiKey'),
  catchAsync(async (req, res) => {
    const response = await generateApiKey();
    res.status(201).send(response);
  })
);

// example of use
// router
// .route('/info/:playerEmail')
// .get(validateApiKey,playerController.getPlayerInfo);

module.exports = router;
