const puppeteer = require('puppeteer');
const { NODE_ENV = 'development' } = process.env;

const puppeteerConfig = async () =>
  await puppeteer.launch({
    timeout: 0,
    headless: true,
    ...(NODE_ENV !== 'development' && { executablePath: '/usr/bin/chromium' }),
    args: ['--no-sandbox'],
  });

module.exports = puppeteerConfig();
