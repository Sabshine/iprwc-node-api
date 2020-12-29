const ApiResponse = require('./utils/apiResponse')
const OrderDAO = require('../dao/orderDAO')
const UserDAO = require('../dao/userDAO')
const productDAO = require('../dao/productDAO')
const ProductOrder = require('../models/productOrder')
const Order = require('../models/order')

module.exports = class OrderController {
  static getAllOrders (req, res, next) {
    if (!req.user.isAdmin) {
      return ApiResponse.errorResponse(401, 'Not authorized', res)
    }
    OrderDAO.getAllOrders().then((orders) => {
      return ApiResponse.successResponse(orders, res)
    }).catch((ignored) => {
      return ApiResponse.errorResponse(500, 'Failed to retrieve filled all orders', res)
    })
  }

  static getOrderById (req, res, next) {
    const orderId = req.params.orderId
    OrderDAO.getOrderById(orderId).then((order) => {
      if (order.user === req.user.id || UserDAO.isUserAdmin(req.user.id)) {
        return ApiResponse.successResponse(order, res)
      } else {
        return ApiResponse.successResponse(403, 'Not allowed', res)
      }
    }).catch((ignored) => {
      return ApiResponse.errorResponse(500, 'Failed to retrieve order', res)
    })
  }

  static canAccessOrders (req) {
    const userId = +req.params.userId
    const userIdOfJWT = +req.user.id

    return req.user.isAdmin || userId === userIdOfJWT
  }

  static async getOrdersFromCustomer (req, res, next) {
    try {
      if (!OrderController.canAccessOrders(req)) {
        return ApiResponse.errorResponse(401, 'Not authorized', res)
      }
      const userId = req.params.userId
      const user = await UserDAO.getUserbyUserId(userId)
      if (user === undefined) {
        return ApiResponse.errorResponse(404, 'Customer not found', res)
      }
      const ordersFromUser = await OrderDAO.getAllOrdersFromCustomer(user[0])

      return ApiResponse.successResponse(ordersFromUser, res)
    } catch (ignored) {
      return ApiResponse.errorResponse(500, 'Failed to fetch orders', res)
    }
  }

  static async placeOrder (req, res, next) {
    const user = await UserDAO.getUserbyUserId(req.user.id)
    const productOrders = req.body

    if (!OrderController.canAccessOrders(req)) {
      return ApiResponse.errorResponse(401, 'Not authorized', res)
    }

    const productOrdersModels = []
    for (let i = 0; i < productOrders.length; i++) {
      const productOrder = productOrders[i]

      const product = await productDAO.getProductById(productOrder.productId)

      if (product === undefined) {
        return ApiResponse.errorResponse(404, `Product with id ${productOrder.productId} could not be found`, res)
      }

      productOrdersModels.push(new ProductOrder(
        product,
        productOrder.amount
      ))
    }

    const order = new Order(undefined, user[0].id, undefined, productOrdersModels, undefined)
    try {
      await OrderDAO.saveOrder(order)
      return ApiResponse.successResponse({
        saved: true
      }, res)
    } catch (ignored) {
      return ApiResponse.errorResponse(404, 'One or more products could not be found', res)
    }
  }
}
