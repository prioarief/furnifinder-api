const knex = require('../../config/knex');
const logger = require('../../config/logger');
const sentry = require('../../config/sentry');
const Ikea = require('../services/ikea');

module.exports = {
  ikea: async () => {
    try {
      logger.info('Fetch categories from Ikea');
      const ikea = new Ikea();
      const categories = await ikea.getCategories();

      await knex('categories')
        .insert(categories)
        .onConflict('external_id')
        .merge();

      logger.info('Complete Fetch categories from Ikea');
    } catch (error) {
      logger.error(error)
      sentry.captureException(error);
    }
  },
};
