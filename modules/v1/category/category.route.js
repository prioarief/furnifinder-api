const express = require('express');
const categoryController = require('./category.controller');

const categoryRouter = express.Router();

categoryRouter.get('/', categoryController.list);

module.exports = categoryRouter;
