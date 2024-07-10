const knex = require('../../config/knex');
const logger = require('../../config/logger');
const puppeteer = require('../../config/puppeteer');
const sentry = require('../../config/sentry');
const Ikea = require('../services/ikea');

module.exports = {
  ikea: async function () {
    try {
      logger.info('Fetch blog post from Ikea');
      
      const browser = await puppeteer
      const ikea = new Ikea();
      const blogs = await ikea.getBlog(browser)
      
      await knex('blogs')
      .insert(blogs)
      .onConflict('external_id')
      .merge();

      logger.info('Finish Fetch blog post from Ikea');
    } catch (error) {
      sentry.captureException(error);
    }
  },
};
