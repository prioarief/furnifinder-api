const express = require('express');
const blogController = require('./blog.controller');

const blogRouter = express.Router();

blogRouter.get('/', blogController.list);

module.exports = blogRouter;
