module.exports = class Order {
  constructor (orderId, user, orderDate, productOrders, orderStatus) {
    this.orderId = orderId
    this.user = user
    this.orderDate = orderDate
    this.productOrders = productOrders
    this.orderStatus = orderStatus
  }

  get getOrderId () {
    return this.orderId
  }

  get getUser () {
    return this.user
  }

  get getOrderDate () {
    return this.orderDate
  }

  get getProductOrders () {
    return this.productOrders
  }

  get getOrderStatus () {
    return this.orderStatus
  }
}
