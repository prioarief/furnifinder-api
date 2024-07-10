const knex = require('../../config/knex');
const logger = require('../../config/logger');
const puppeteer = require('../../config/puppeteer');
const sentry = require('../../config/sentry');
const Ikea = require('../services/ikea');
const Mitra10 = require('../services/mitra10');
const sleep = require('../utils/sleep');

const fetch = async (categoryId, limit, page, data) => {
  let products = data;
  const mitra10 = new Mitra10();
  const { items, page_info } = await mitra10.getProducts(
    categoryId,
    limit,
    page
  );

  products = [...products, ...items];

  if (page_info.total_pages > page) {
    return await fetch(categoryId, limit, page + 1, products);
  }

  return products;
};

module.exports = {
  ikea: async function (
    page = 1,
    limit = 1,
    offset = 0,
    totalData = null,
    totalPage = 0,
    browser
  ) {
    try {
      if (!totalData) {
        const { count_data } = await knex('categories')
          .where('source', 'ikea')
          .first(knex.raw('count(id) as count_data'));

        totalData = count_data;
        totalPage = Math.ceil(totalData / limit);
        offset = (page - 1) * limit;

        browser = await puppeteer;

        return await this.ikea(
          page,
          limit,
          offset,
          totalData,
          totalPage,
          browser
        );
      }

      let currentPage = page;
      if (currentPage <= 3) {
        logger.info(`Fetch Products From Ikea ${currentPage}/${totalPage}`);

        const categories = await knex('categories')
          .leftJoin(
            knex('products')
              .groupBy('category_id')
              .select('category_id', knex.raw('COUNT(id) as count_data'))
              .as('sub'),
            'sub.category_id',
            'category_id'
          )
          .where('source', 'ikea')
          .orderBy('count_data', 'asc')
          .limit(limit)
          .offset(offset)
          .select('id', 'external_id');

        const ikea = new Ikea();

        const products = await Promise.all(
          categories.map(async (e) => {
            const url = atob(atob(e.external_id));
            return await ikea.getProducts(
              browser,
              `https://www.ikea.co.id${url}`,
              e.id
            );
          })
        );

        const result = products.flatMap((e) => e.flatMap((f) => f));
        const payload = result.map((e) => {
          return {
            category_id: e.category_id,
            sku: e.item_id,
            name: `${e.item_list_name} - ${e.item_brand}`,
            // description: '',
            special_price: e.price,
            // rating_summary: '',
            stock_status: 'IN STOCK',
            image_url: e.image_url,
            // video_url: '',
            url: e.link,
            // media_gallery: '',
            // reviews: '',
            brand: e.item_brand,
          };
        });

        await knex('products').insert(payload).onConflict('sku').merge();
        currentPage++;

        await sleep(5000);

        await this.ikea(
          currentPage,
          limit,
          (currentPage - 1) * limit,
          totalData,
          totalPage,
          browser
        );
      } else {
        await browser.close();
        logger.info('Complete Fetch Products From Ikea');
      }
    } catch (error) {
      await browser.close();
      sentry.captureException(error);
    }
  },
};
