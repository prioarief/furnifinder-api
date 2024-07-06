const knex = require('../../../config/knex');

class CategoryModel {
  static async list() {
    return await knex('categories').select('id', 'name');
  }
}

module.exports = CategoryModel
