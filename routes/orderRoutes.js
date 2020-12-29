const express = require('express')
const AuthorizationUtil = require('../util/auhtorizationUtil')
const OrderController = require('../controllers/orderController')

const router = express.Router()

router.get('/:orderId', AuthorizationUtil.isAuthenticatedAsUser, OrderController.getOrderById)
router.get('/user/:userId', AuthorizationUtil.isAuthenticatedAsUser, OrderController.getOrdersFromCustomer)
router.get('/', AuthorizationUtil.isAuthenticatedAsAdmin, OrderController.getAllOrders)

router.post('/user/:userId', AuthorizationUtil.isAuthenticatedAsUser, OrderController.placeOrder)

module.exports = router
