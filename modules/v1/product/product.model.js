const knex = require('../../../config/knex');

class ProductModel {
  static async count(filter) {
    const { keyword } = filter;
    return await knex('products')
      .where((cond) => {
        if (keyword) {
          cond.whereRaw('name LIKE ?', [`%${keyword}%`]);
        }
      })
      .first(knex.raw('COUNT(id) as count_data'));
  }

  static async list(paginate, filter) {
    const { keyword } = filter;

    return await knex('products as p')
      .join('categories as c', 'c.id', 'p.category_id')
      .where((cond) => {
        if (keyword) {
          cond.whereRaw('p.name LIKE ?', [`%${keyword}%`]);
        }
      })
      .orderBy('p.rating_summary', 'desc')
      .limit(paginate.limit)
      .offset(paginate.perPage)
      .select(
        'p.id',
        'p.name',
        knex.raw('CONVERT(p.special_price, SIGNED) as price'),
        'p.image_url',
        knex.raw('p.rating_summary/20 as rating'),
        'c.name as category_name'
      );
  }

  static async detail(id) {
    return await knex('products as p')
      .join('categories as c', 'c.id', 'p.category_id')
      .where('p.id', id)
      .first(
        'p.id',
        'p.name',
        'p.image_url',
        'p.description',
        'p.video_url',
        'p.reviews',
        'p.url',
        'p.stock_status',
        'p.media_gallery',
        knex.raw('p.rating_summary/20 as rating'),
        knex.raw('CONVERT(p.special_price, SIGNED) as price'),
        'c.name as category_name'
      );
  }

  static async popular() {
    const subProductView = knex('product_views')
      .groupBy('product_id')
      .select('product_id', knex.raw('COUNT(id) as count_data'));

    return await knex('products as p')
      .join('categories as c', 'c.id', 'p.category_id')
      .leftJoin(
        subProductView.as('sub_product_view'),
        'sub_product_view.product_id',
        'p.id'
      )
      .orderBy('sub_product_view.count_data', 'desc')
      .limit(10)
      .select(
        'p.id',
        'p.name',
        'p.image_url',
        knex.raw('p.rating_summary/20 as rating'),
        knex.raw('CONVERT(p.special_price, SIGNED) as price'),
        'c.name as category_name'
      );
  }

  static async insertProductView(productId) {
    return await knex('product_views').insert({ product_id: productId });
  }
}

module.exports = ProductModel;
