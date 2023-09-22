const express = require('express');
const validate = require('../../middlewares/validate');
const profileValidation = require('../../validations/profile.validation');
const profileController = require('../../controllers/profile.controller');
const { validateApiKey } = require('../../middlewares/apiKey');

const router = express.Router();

router
  .route('/:profileId')
  .get(validateApiKey, validate(profileValidation.getProfile), profileController.getProfile)
  .patch(validateApiKey, validate(profileValidation.updateProfile), profileController.updateProfile)
  .delete(validateApiKey, validate(profileValidation.deleteProfile), profileController.deleteProfile)

router
  .route('/')
  .post(validateApiKey, validate(profileValidation.createProfile), profileController.createProfile)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Profile management and retrieval
 */

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create a profile
 *     description: Only autorize users with a valid api can create profiles.
 *     tags: [Profiles]
 *     security:
 *      - apiKeyHeader: []
 *      - apiKeyIdHeader: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - preferences
 *               - min_price
 *               - max_price
 *             properties:
 *               preferences:
 *                 type: string
 *               min_price:
 *                 type: number
 *               max_price:
 *                 type: number
 *             example:
 *               preferences: '[ "Female", "Young Adult", "Adult"]'
 *               min_price: 32,
 *               max_price: 50
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Profile'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Get a profile
 *     description:  Only autorize users with a valid api can fetch only profile information.
 *     tags: [Profiles]
 *     security:
 *      - apiKeyHeader: []
 *      - apiKeyIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Profile'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a profile
 *     description: Only autorize users with a valid api can update information.
 *     tags: [Profiles]
 *     security:
 *      - apiKeyHeader: []
 *      - apiKeyIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - preferences
 *               - min_price
 *               - max_price
 *             properties:
 *               preferences:
 *                 type: string
 *               min_price:
 *                 type: number
 *               max_price:
 *                 type: number
 *             example:
 *               preferences: '["Female", "Young Adult", "Adult"]'
 *               min_price: 32
 *               max_price: 50
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Profile'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a profile
 *     description:  Only autorize users with a valid api can delete profiles.
 *     tags: [Profiles]
 *     security:
 *      - apiKeyHeader: []
 *      - apiKeyIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
