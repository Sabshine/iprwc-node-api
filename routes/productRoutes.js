const express = require('express')
const AuthorizationUtil = require('../util/auhtorizationUtil')
const ProductController = require('../controllers/productController')

const router = express.Router()

router.get('/:productId', ProductController.productById)
router.get('/', ProductController.product)
router.post('/', AuthorizationUtil.isAuthenticatedAsAdmin, ProductController.saveProduct)
router.patch('/:productId', AuthorizationUtil.isAuthenticatedAsAdmin, ProductController.editProduct)
router.delete('/:productId', AuthorizationUtil.isAuthenticatedAsAdmin, ProductController.deleteProductById)

module.exports = router
