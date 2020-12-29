const express = require('express')
const orderRouter = require('./orderRoutes')
const authorizationRoutes = require('./authorizationRoutes')
const productRoutes = require('./productRoutes')
const userRoutes = require('./userRoutes')

const router = express.Router()

router.use('/auth/', authorizationRoutes)
router.use('/orders/', orderRouter)
router.use('/products/', productRoutes)
router.use('/user/', userRoutes)

module.exports = router
