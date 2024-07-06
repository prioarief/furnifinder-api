const fetch_categories = require('./fetch_categories');
const fetch_product_detail = require('./fetch_product_detail');
const fetch_products = require('./fetch_products');

const jobType = {
  every: 'every',
  schedule: 'schedule',
};

const jobs = [
  // {
  //   type: jobType.every,
  //   value: '00 00 * * *',
  //   name: 'fetch mitra 10 categories',
  //   action: async () => fetch_categories('mitra10'),
  // },
  // {
  //   type: jobType.every,
  //   value: '00 01 * * *',
  //   name: 'fetch mitra 10 products',
  //   action: async () => fetch_products(),
  // },
  // {
  //   type: jobType.every,
  //   value: '00 00 * * *',
  //   name: 'fetch ikea categories',
  //   action: async () => fetch_categories.ikea(),
  // },
  // {
  //   type: jobType.every,
  //   value: '57 15 * * *',
  //   // value: '*/10 * * * * *',
  //   name: 'fetch ikea products',
  //   action: async () => await fetch_products.ikea(),
  // },
  {
    type: jobType.every,
    value: '04 17 * * *',
    // value: '*/10 * * * * *',
    name: 'fetch ikea product detail',
    action: async () => await fetch_product_detail.ikea(),
  },
];

module.exports = jobs;
