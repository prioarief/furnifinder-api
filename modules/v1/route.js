const express = require('express')
const categoryRouter = require('./category/category.route')
const productRouter = require('./product/product.route')
const blogRouter = require('./blog/blog.route')

const v1Router = express.Router()

v1Router.use('/categories', categoryRouter)
v1Router.use('/products', productRouter)
v1Router.use('/blogs', blogRouter)

module.exports = v1Router
