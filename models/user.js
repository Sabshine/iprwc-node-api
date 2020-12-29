module.exports = class User {
  constructor (id, email, firstname, lastname, street, housenumber, postalcode, country, isAdmin) {
    this.id = id
    this.email = email
    this.firstname = firstname
    this.lastname = lastname
    this.street = street
    this.housenumber = housenumber
    this.postalcode = postalcode
    this.country = country
    this.isAdmin = isAdmin
  }

  get getId () {
    return this.id
  }

  get getEmail () {
    return this.email
  }

  set hashedPassword (password) {
    this.hashedPassword = password
  }

  get hashedPassword () {
    return this.hashedPassword
  }

  get getFirstname () {
    return this.firstname
  }

  get getLastname () {
    return this.lastname
  }

  get getStreet () {
    return this.street
  }

  get getHousenumber () {
    return this.housenumber
  }

  get getPostalcode () {
    return this.postalcode
  }

  get getCountry () {
    return this.country
  }

  get getIsAdmin () {
    return this.isAdmin
  }
}
