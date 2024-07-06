const express = require('express');
const productController = require('./product.controller');

const productRouter = express.Router();

productRouter.get('/', productController.list);
productRouter.get('/popular', productController.popular);
productRouter.get('/:id', productController.detail);

module.exports = productRouter;
