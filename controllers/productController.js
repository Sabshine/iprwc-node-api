const Product = require('../models/product')
const ProductDAO = require('../dao/productDAO')
const UserDAO = require('../dao/userDAO')
const ApiResponse = require('./utils/apiResponse')

module.exports = class ProductController {
  static product (req, res, next) {
    ProductDAO.getAllProducts().then((products) => {
      return ApiResponse.successResponse(products, res)
    }).catch((ignored) => {
      return ApiResponse.errorResponse(500, 'Failed to retrieve products', res)
    })
  }

  static productById (req, res, next) {
    var productId = req.params.productId
    ProductDAO.getProductById(productId).then((product) => {
      return ApiResponse.successResponse(product, res)
    }).catch((ignored) => {
      return ApiResponse.errorResponse(500, 'Failed to retrieve products', res)
    })
  }

  static saveProduct (req, res, next) {
    const productName = req.body.productName
    const productPrice = req.body.productPrice
    const productDescription = req.body.productDescription
    const productCategorie = req.body.productCategorie
    const productUrl = req.body.productUrl

    if (productName.length > 0) {
      const product = new Product(undefined, productName, productPrice, productDescription, productCategorie, productUrl, true)

      ProductDAO.saveProduct(product).then((product) => {
        if (UserDAO.isUserAdmin(req.user.id)) {
          return ApiResponse.successResponse(product, res)
        } else {
          return ApiResponse.successResponse(403, 'Not allowed', res)
        }
      }).catch((ignored) => {
        return ApiResponse.errorResponse(500, 'Failed to save products', res)
      })
    } else {
      return ApiResponse.errorResponse(400, 'Something went wrong', res)
    }
  }

  static editProduct (req, res, next) {
    var productId = req.params.productId
    const productName = req.body.productName
    const productPrice = req.body.productPrice
    const productDescription = req.body.productDescription
    const productCategorie = req.body.productCategorie
    const productUrl = req.body.productUrl

    if (productId !== null) {
      const product = new Product(productId, productName, productPrice, productDescription, productCategorie, productUrl, true)

      ProductDAO.updateProduct(productId, product).then((product) => {
        if (UserDAO.isUserAdmin(req.user.id)) {
          return ApiResponse.successResponse(product, res)
        } else {
          return ApiResponse.successResponse(403, 'Not allowed', res)
        }
      }).catch((ignored) => {
        return ApiResponse.errorResponse(500, 'Failed to save edited product', res)
      })
    } else {
      return ApiResponse.errorResponse(400, 'Something went wrong', res)
    }
  }

  static deleteProductById (req, res, next) {
    var productId = req.params.productId
    ProductDAO.deleteProductById(productId).then((product) => {
      if (UserDAO.isUserAdmin(req.user.id)) {
        return ApiResponse.successResponse(product, res)
      } else {
        return ApiResponse.successResponse(403, 'Not allowed', res)
      }
    }).catch((ignored) => {
      return ApiResponse.errorResponse(500, 'Failed to retrieve products', res)
    })
  }
}
