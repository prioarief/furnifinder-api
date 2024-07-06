const knex = require('../../config/knex');
const logger = require('../../config/logger');
const puppeteer = require('../../config/puppeteer');
const sentry = require('../../config/sentry');
const Ikea = require('../services/ikea');
const sleep = require('../utils/sleep');

module.exports = {
  ikea: async function (
    page = 1,
    limit = 15,
    offset = 0,
    totalData = null,
    totalPage = 0
  ) {
    try {
      if (!totalData) {
        const { count_data } = await knex('products as p')
          .leftJoin('categories as c', 'c.id', 'p.category_id')
          .where('c.source', 'ikea')
          .first(knex.raw('count(p.id) as count_data'));

        totalData = count_data;
        totalPage = Math.ceil(totalData / limit);
        offset = (page - 1) * limit;

        return await this.ikea(page, limit, offset, totalData, totalPage);
      }

      let currentPage = page;
      if (currentPage <= totalPage) {
        logger.info(`Fetch Product Detail From Ikea ${currentPage}/${totalPage}`);

        const products = await knex('products as p')
          .leftJoin('categories as c', 'c.id', 'p.category_id')
          .where('c.source', 'ikea')
          .orderBy('index_priority')
          .limit(limit)
          .offset(offset)
          .select(
            'p.id',
            'p.url',
            'p.sku',
            knex.raw(
              'CASE WHEN p.description IS NULL THEN 0 ELSE 1 END as index_priority'
            )
          );

        const ikea = new Ikea();
        const data = await Promise.all(
          products.map(async (e) => {
            const detail = await ikea.getProductDetail(e.url);

            return {
              sku: e.sku,
              description: `${detail.description}. ${detail.benefit}`,
              media_gallery: JSON.stringify(detail.images)
            };
          })
        );

        await knex('products').insert(data).onConflict('sku').merge();
        currentPage++;

        return this.ikea(
          currentPage,
          limit,
          (currentPage - 1) * limit,
          totalData,
          totalPage
        );
      } else {
        logger.info('Complete Fetch Product Detail From Mitra 10');
      }
    } catch (error) {
      sentry.captureException(error);
    }
  },
};
