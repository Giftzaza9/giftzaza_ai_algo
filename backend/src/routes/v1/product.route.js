const express = require('express');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');
const { validateApiKey } = require('../../middlewares/apiKey');
const auth = require('../../middlewares/auth');
const { rightsEnum } = require('../../config/roles');

const router = express.Router();

router
  .route('/:productId')
  .delete(auth(rightsEnum.MANAGE_PRODUCTS), validate(productValidation.deleteProduct), productController.deleteProduct)
  .patch(auth(rightsEnum.MANAGE_PRODUCTS), validate(productValidation.updateProduct), productController.updateProduct);

router
  .route('/scrape')
  .post(auth(rightsEnum.MANAGE_PRODUCTS), validate(productValidation.scrapeProduct), productController.scrapeProduct);

router
  .route('/')
  .get(validate(productValidation.getProducts), productController.getProducts)
  .post(auth(rightsEnum.MANAGE_PRODUCTS), validate(productValidation.createProduct), productController.createProduct);

router
  .route('/analysis')
  .post(auth(rightsEnum.MANAGE_PRODUCTS), validate(productValidation.createAnalysisProduct), productController.createAnalysisProduct);
  // .get(validate(productValidation.getProducts), productController.getAnalysisProducts)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products management and retrieval
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a product
 *     description: Only autorize users with a valid api can create products.
 *     tags: [Products]
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
 *               - product_link
 *             properties:
 *               product_link:
 *                 type: string
 *             example:
 *               product_link: "https://www.amazon.com/dp/B0BHSPL274/ref=syn_sd_onsite_desktop_0?ie=UTF8&psc=1&pf_rd_p=364912db-e534-48ad-9b87-1666e0a1ca2b&pf_rd_r=7WT9QS8FNYACBA628VN1&pd_rd_wg=PXkjr&pd_rd_w=uvJqz&pd_rd_r=03484750-f95b-41b9-8669-193729f95b58"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Product'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get all the products
 *     description:  Only autorize users with a valid api can fetch all the product information.
 *     tags: [Products]
 *     security:
 *      - apiKeyHeader: []
 *      - apiKeyIdHeader: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: Array
 *                items:
 *                  $ref: '#/components/schemas/Products'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product
 *     description: Only autorize users with a valid api can update information.
 *     tags: [Products]
 *     security:
 *      - apiKeyHeader: []
 *      - apiKeyIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tags
 *             properties:
 *               tags:
 *                 type: string
 *             example:
 *               tags: '["Female", "Young Adult", "Adult"]'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Product'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a product
 *     description:  Only autorize users with a valid api can delete products.
 *     tags: [Products]
 *     security:
 *      - apiKeyHeader: []
 *      - apiKeyIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product id
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
