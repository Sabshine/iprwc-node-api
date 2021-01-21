const AccessDB = require('./accessDB')
const User = require('../models/user')

module.exports = class UserDAO {
  static async saveUser (user, hashedPassword) {
    const result = await AccessDB.executeSQLStatement(
      'INSERT INTO "User"(email, password, firstname, lastname, street, housenumber, postalcode, country, isAdmin) ' +
      'VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      user.getEmail, hashedPassword, user.getFirstname, user.getLastname, user.getStreet, user.getHousenumber, user.getPostalcode, user.getCountry, false
    )

    return result.rowCount === 1
  }

  static async getUserByEmail (email) {
    const result = await AccessDB.executeSQLStatement(
      'SELECT * FROM "User" WHERE email=$1', email
    )

    if (result.rowCount > 0) {
      const row = result.rows[0]

      const user = new User(row.userid, row.email)
      user.hashPassword = row.password
      return user
    }

    return undefined
  }

  static async isUserAdmin (user) {
    const result = await AccessDB.executeSQLStatement(
      'SELECT * FROM "User" WHERE userid=$1 AND isAdmin=true', user.getId
    )

    return result.rowCount > 0
  }

  static async getUsers () {
    const result = await AccessDB.executeSQLStatement('SELECT "User".email,"User".userid, adminuserid FROM "User" LEFT JOIN adminuser ON "User".userid = adminuser.userid')
    return result.rows.map(user => new User(user.adminuserid, user.email)
    )
  }

  static async getUserbyUserId (userId) {
    const result = await AccessDB.executeSQLStatement(
      'SELECT * FROM "User" WHERE userid=$1', userId
    )

    const user = []

    result.rows.forEach((row) => {
      user.push(new User(
        row.userid,
        row.email,
        row.password,
        row.firstname,
        row.lastname,
        row.street,
        row.housenumber,
        row.postalcode,
        row.country,
        row.isadmin
      ))
    })

    return user
  }
}
