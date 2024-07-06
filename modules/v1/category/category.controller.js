const response = require('../../utils/response');
const CategoryModel = require('./category.model');

class CategoryController {
  static async list(req, res, next) {
    try {
      const categories = await CategoryModel.list();
      return response(
        res,
        200,
        'Successfully Get Categories',
        null,
        categories
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
