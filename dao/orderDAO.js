const AccessDB = require('./accessDB')
const ProductOrder = require('../models/productOrder')
const Order = require('../models/order')
const ProductDAO = require('./productDao')
const UserDAO = require('./userDao')

module.exports = class OrderDAO {
  static async getOrderById (orderId) {
    const result = await AccessDB.executeSQLStatement(
      'SELECT * FROM "Order" WHERE orderId = $1',
      orderId
    )

    const orderModel = []
    if (result.rowCount > 0) {
      for (let i = 0; i < result.rows.length; i++) {
        const orderResult = result.rows[i]

        const productOrdersResult = await AccessDB.executeSQLStatement(
            `
            SELECT *
            FROM orderdetail
            JOIN product p on orderdetail.productid = p.productid
            WHERE orderid=$1
            `,
            orderResult.orderid
        )
        const productOrders = []
        if (productOrdersResult.rowCount > 0) {
          const products = ProductDAO.queryResultToModel(productOrdersResult)

          for (let j = 0; j < products.length; j++) {
            productOrders.push(new ProductOrder(
              products[j],
              productOrdersResult.rows[j].quantityordered
            ))
          }
        }

        const userOfOrder = await UserDAO.getUserbyUserId(orderResult.userid)
        const order = new Order(
          orderResult.orderid,
          userOfOrder[0].id,
          orderResult.orderdate,
          productOrders,
          orderResult.orderstatus
        )
        orderModel.push(order)
      }
    }
    return orderModel[0]
  }

  static async getAllOrders () {
    const result = await AccessDB.executeSQLStatement(
      'SELECT * FROM "Order"'
    )

    const orderModels = []
    if (result.rowCount > 0) {
      for (let i = 0; i < result.rows.length; i++) {
        const orderResult = result.rows[i]

        const productOrdersQueryResult = await AccessDB.executeSQLStatement(
            `
            SELECT *
            FROM orderdetail
            JOIN product p on orderdetail.productid = p.productid
            WHERE orderid=$1
            `,
            orderResult.orderid
        )
        const productOrders = []
        if (productOrdersQueryResult.rowCount > 0) {
          const products = ProductDAO.queryResultToModel(productOrdersQueryResult)
          for (let j = 0; j < products.length; j++) {
            productOrders.push(new ProductOrder(
              products[j],
              productOrdersQueryResult.rows[j].quantityordered
            ))
          }
        }

        const userOfOrder = await UserDAO.getUserbyUserId(orderResult.userid)
        const order = new Order(
          orderResult.orderid,
          userOfOrder[0].id,
          orderResult.orderdate,
          productOrders,
          orderResult.orderstatus
        )
        orderModels.push(order)
      }
    }
    return orderModels
  }

  static async getAllOrdersFromCustomer (user) {
    const result = await AccessDB.executeSQLStatement(
      'SELECT * FROM "Order" WHERE userid=$1',
      user.id
    )
    const orderModels = []
    if (result.rowCount > 0) {
      for (let i = 0; i < result.rows.length; i++) {
        const orderResult = result.rows[i]

        const productOrdersQueryResult = await AccessDB.executeSQLStatement(
            `
            SELECT *
            FROM orderdetail
            JOIN product p on orderdetail.productid = p.productid
            WHERE orderid=$1
            `,
            orderResult.orderid
        )
        const productOrders = []
        if (productOrdersQueryResult.rowCount > 0) {
          const products = ProductDAO.queryResultToModel(productOrdersQueryResult)
          for (let j = 0; j < products.length; j++) {
            productOrders.push(new ProductOrder(
              products[j],
              productOrdersQueryResult.rows[j].quantityordered
            ))
          }
        }
        const userOfOrder = await UserDAO.getUserbyUserId(orderResult.userid)
        const order = new Order(
          orderResult.orderid,
          userOfOrder[0].id,
          orderResult.orderdate,
          productOrders,
          orderResult.orderstatus
        )
        orderModels.push(order)
      }
    }
    return orderModels
  }

  static async saveOrder (order) {
    const newOrderQueryResult = await AccessDB.executeSQLStatement(
        `INSERT INTO "Order" (userid, orderdate, orderstatus)
        VALUES ($1::integer, CURRENT_TIMESTAMP, 'PROCESSING') RETURNING orderid`,
        order.user
    )

    let savedProductOrders = []

    for (let i = 0; i < order.productOrders.length; i++) {
      const productOrder = order.productOrders[i]
      const productId = productOrder.product[0].productId || 0
      const amount = productOrder.amount || 0

      savedProductOrders = await AccessDB.executeSQLStatement(
        'INSERT INTO orderdetail (orderdetailid, orderid, productid, quantityordered)' +
            'VALUES (DEFAULT, $1, $2, $3)', newOrderQueryResult.rows[0].orderid, productId, amount
      )
    }
    return savedProductOrders
  }
}
