const fetch_blog = require('./fetch_blog');
const fetch_categories = require('./fetch_categories');
const fetch_product_detail = require('./fetch_product_detail');
const fetch_products = require('./fetch_products');

const {
  JOB_IKEA_CATEGORIES = '00 00 * * *',
  JOB_IKEA_PRODUCTS = '00 02 * * *',
  JOB_IKEA_PRODUCT_DETAIL = '00 05 * * *',
  JOB_IKEA_BLOG = '00 05 * * *',
} = process.env;

const jobType = {
  every: 'every',
  schedule: 'schedule',
};

const jobs = [
  {
    type: jobType.every,
    value: JOB_IKEA_CATEGORIES,
    name: 'fetch ikea categories',
    action: async () => fetch_categories.ikea(),
  },
  {
    type: jobType.every,
    value: JOB_IKEA_PRODUCTS,
    name: 'fetch ikea products',
    action: async () => await fetch_products.ikea(),
  },
  {
    type: jobType.every,
    value: JOB_IKEA_PRODUCT_DETAIL,
    name: 'fetch ikea product detail',
    action: async () => await fetch_product_detail.ikea(),
  },
  {
    type: jobType.every,
    value: JOB_IKEA_BLOG,
    name: 'fetch ikea blog',
    action: async () => await fetch_blog.ikea(),
  },
];

module.exports = jobs;
