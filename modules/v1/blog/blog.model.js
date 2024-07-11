const knex = require('../../../config/knex');

class BlogModel {
  static async count(filter) {
    const { keyword } = filter;
    return await knex('blogs')
      .where((cond) => {
        if (keyword) {
          cond.whereRaw('title LIKE ?', [`%${keyword}%`]);
        }
      })
      .first(knex.raw('COUNT(id) as count_data'));
  }

  static async list(paginate, filter) {
    const { keyword } = filter;

    return await knex('blogs as b')
      .where((cond) => {
        if (keyword) {
          cond.whereRaw('b.title LIKE ?', [`%${keyword}%`]);
        }
      })
      .limit(paginate.limit)
      .offset(paginate.perPage)
      .select(
        'b.id',
        'b.title',
        'b.image_url',
        'b.link',
      );
  }
}

module.exports = BlogModel;
