const UserDAO = require('../dao/userDAO')
const ApiResponse = require('./utils/apiResponse')

module.exports = class UserController {
  static getUserId (req, res, next) {
    const email = req.params.email

    UserDAO.getUserByEmail(email).then(user => {
      return ApiResponse.successResponse(user, res)
    }).catch(e => {
      return ApiResponse.errorResponse(500, 'Could not get user', res)
    })
  }

  static exists (req, res, next) {
    const email = req.params.email

    UserDAO.getUserByEmail(email).then(user => {
      if (user) {
        return ApiResponse.successResponse({ exists: true }, res)
      } else {
        return ApiResponse.successResponse({ exists: false }, res)
      }
    }).catch(() => {
      return ApiResponse.errorResponse(500, 'Failed to check if user exists', res)
    })
  }
}
