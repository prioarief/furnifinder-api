const newError = require('../../utils/new_error');
const pagination = require('../../utils/pagination');
const response = require('../../utils/response');
const ProductModel = require('./product.model');
const productValidation = require('./product.validation');

class ProductController {
  static async list(req, res, next) {
    try {
      productValidation.list(req.query);

      const filter = req.query;

      const { count_data } = await ProductModel.count(filter);
      const paginate = await pagination(req, count_data);
      const products = await ProductModel.list(paginate, filter);

      return response(
        res,
        200,
        'Successfully Get Products',
        paginate,
        products
      );
    } catch (error) {
      next(error);
    }
  }

  static async popular(req, res, next) {
    try {
      const products = await ProductModel.popular();
      return response(
        res,
        200,
        'Successfully Get Popular Products',
        null,
        products
      );
    } catch (error) {
      next(error);
    }
  }

  static async detail(req, res, next) {
    try {
      productValidation.detail(req.params);

      const { id } = req.params;

      const product = await ProductModel.detail(id);
      if (!product) {
        throw newError(404, 'Product Not Found')
      }

      await ProductModel.insertProductView(id)

      return response(
        res,
        200,
        'Successfully Get Product Detail',
        null,
        product
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
