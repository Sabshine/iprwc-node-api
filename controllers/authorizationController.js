const AuthorizationUtil = require('../util/auhtorizationUtil')
const UserDAO = require('../dao/userDAO')
const User = require('../models/user')
const ApiResponse = require('./utils/apiResponse')

module.exports = class AuthorizationController {
  static login (req, res, next) {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
      return ApiResponse.errorResponse(400, 'Email or password not supplied', res)
    }

    UserDAO.getUserByEmail(email).then((user) => {
      if (user !== undefined) {
        AuthorizationUtil.validPassword(password, user.hashPassword).then((validPassword) => {
          if (validPassword) {
            UserDAO.isUserAdmin(new User(user.getId, user.getEmail)).then((isUserAdmin) => {
              const token = AuthorizationUtil.createJWT(user.getId, user.getEmail, isUserAdmin)

              return ApiResponse.successResponse({
                key: token,
                isAdmin: isUserAdmin
              }, res)
            })
          } else {
            return ApiResponse.errorResponse(403, 'Invalid password', res)
          }
        })
      } else {
        return ApiResponse.errorResponse(404, 'User not found', res)
      }
    })
  }

  static register (req, res, next) {
    const email = req.body.email
    const password = req.body.password
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const street = req.body.street
    const housenumber = req.body.housenumber
    const postalcode = req.body.postalcode
    const country = req.body.country

    if (!email || !password) {
      return ApiResponse.errorResponse(404, 'Email or password not supplied', res)
    }
    AuthorizationUtil.hashPassword(password).then((hashedPassword) => {
      // 0 because the id is not defined yet
      const user = new User(0, email, firstname, lastname, street, housenumber, postalcode, country, false)

      UserDAO.getUserByEmail(email).then((userObj) => {
        // undefined means not found
        if (userObj === undefined) {
          UserDAO.saveUser(user, hashedPassword).then((success) => {
            if (success) {
              UserDAO.getUserByEmail(email).then((user) => {
                return ApiResponse.successResponse({
                  key: AuthorizationUtil.createJWT(user.getId, user.getEmail, false),
                  isAdmin: false
                }, res)
              })
            }
          })
        } else {
          return ApiResponse.errorResponse(303, 'User with the given email already exists', res)
        }
      })
    })
  }
}
