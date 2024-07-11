const pagination = require('../../utils/pagination');
const response = require('../../utils/response');
const BlogModel = require('./blog.model');
const blogValidation = require('./blog.validation');

class BlogController {
  static async list(req, res, next) {
    try {
      blogValidation.list(req.query);

      const filter = req.query;

      const { count_data } = await BlogModel.count(filter);
      const paginate = await pagination(req, count_data);
      const blogs = await BlogModel.list(paginate, filter);

      return response(
        res,
        200,
        'Successfully Get Blogs',
        paginate,
        blogs
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BlogController;
