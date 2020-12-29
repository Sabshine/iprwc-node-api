const Product = require('../models/product')
const AccessDB = require('./accessDB')

module.exports = class ProductDAO {
  static async getAllProducts () {
    const result = await AccessDB.executeSQLStatement(
      'SELECT * FROM product WHERE isactive = true'
    )

    const products = []

    result.rows.forEach((row) => {
      products.push(new Product(
        row.productid,
        row.productname,
        row.productprice,
        row.productdescription,
        row.productcategorie,
        row.producturl,
        row.isactive
      ))
    })

    return products
  }

  static async getProductById (productId) {
    const result = await AccessDB.executeSQLStatement(
      'SELECT * FROM product WHERE productid=$1::integer AND isactive=true', productId
    )
    const products = []

    result.rows.forEach((row) => {
      products.push(new Product(
        row.productid,
        row.productname,
        row.productprice,
        row.productdescription,
        row.productcategorie,
        row.producturl,
        row.isactive
      ))
    })

    return products
  }

  static async deleteProductById (productId) {
    const result = await AccessDB.executeSQLStatement(
      'UPDATE product SET isActive=false WHERE productId = $1', productId
    )

    return result.rowCount === 1
  }

  static async updateProduct (productId, updatedProduct) {
    const result = await AccessDB.executeSQLStatement(
      'UPDATE product SET productId=$1, productName=$2, productPrice=$3, productDescription=$4, productCategorie=$5, productUrl=$6, isActive=$7 ' +
      'WHERE productid=$1::integer',
      productId, updatedProduct.getProductName, updatedProduct.getProductPrice, updatedProduct.getProductDescription, updatedProduct.getProductCategorie, updatedProduct.getProductUrl, true
    )

    return result.rowCount > 0
  }

  static async saveProduct (product) {
    const result = await AccessDB.executeSQLStatement(
      'INSERT INTO product(productId, productName, productPrice, productDescription, productCategorie, productUrl, isActive) ' +
      'VALUES(default, $1, $2, $3, $4, $5, $6)',
      product.getProductName, product.getProductPrice, product.getProductDescription, product.getProductCategorie, product.getProductUrl, true
    )

    return result.rowCount > 0
  }

  static queryResultToModel (productQuery) {
    if (productQuery.rowCount > 0) {
      const products = []

      productQuery.rows.forEach((row) => {
        products.push(new Product(
          row.productid,
          row.productname,
          row.productprice,
          row.productdescription,
          row.productcategorie,
          row.producturl,
          row.isactive
        ))
      })
      return products
    }
    return []
  }
}
