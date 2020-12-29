module.exports = class ProductOrder {
  constructor (product, amount) {
    this.product = product
    this.amount = amount
  }

  get getProduct () {
    return this.product
  }

  get getAmount () {
    return this.amount
  }
}
