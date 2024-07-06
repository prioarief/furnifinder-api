const express = require('express')
const categoryRouter = require('./category/category.route')
const productRouter = require('./product/product.route')

const v1Router = express.Router()

v1Router.use('/categories', categoryRouter)
v1Router.use('/products', productRouter)

module.exports = v1Router
