module.exports = class Product {
  constructor (productId, productName, productPrice, productDescription, productCategorie, productUrl, isActive) {
    this.productId = productId
    this.productName = productName
    this.productPrice = productPrice
    this.productDescription = productDescription
    this.productCategorie = productCategorie
    this.productUrl = productUrl
    this.isActive = isActive
  }

  get getProductId () {
    return this.productId
  }

  get getProductName () {
    return this.productName
  }

  get getProductPrice () {
    return this.productPrice
  }

  get getProductDescription () {
    return this.productDescription
  }

  get getProductCategorie () {
    return this.productCategorie
  }

  get getProductUrl () {
    return this.productUrl
  }

  get getisActive () {
    return this.isActive
  }
}
