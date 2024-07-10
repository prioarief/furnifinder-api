const cheerio = require('cheerio');
const puppeteer = require('../../config/puppeteer');
const logger = require('../../config/logger');
const { default: axios } = require('axios');

const { IKEA_CATEGORIES = 'https://www.ikea.co.id/in/produk' } = process.env;

class Ikea {
  async getCategories() {
    try {
      const browser = await puppeteer;
      const page = await browser.newPage();
      await page.goto(IKEA_CATEGORIES, {
        waitUntil: 'networkidle2',
      });

      const content = await page.content();
      const $ = cheerio.load(content);

      const categoryPromises = [];
      $('.all-products-columns .all-products-column-component').each(
        (_, element) => {
          const promises = $(element)
            .find('.options-column .all-products-row-component')
            .map((_, element2) => {
              const name = $(element2).find('h3 > a').text().trim();
              const link = $(element2).find('h3 > a').attr('href');

              return {
                name,
                // link: `https://www.ikea.co.id${link}`,
                external_id: Buffer.from(
                  Buffer.from(link).toString('base64')
                ).toString('base64'),
                source: 'ikea',
              };
            })
            .get();

          categoryPromises.push(...promises);
        }
      );

      // const categories = await Promise.all(categoryPromises);
      await page.close();

      return categoryPromises;
    } catch (error) {
      throw error;
    }
  }

  async getProducts(browser, baseUrl, categoryId) {
    // const browser = await puppeteer;

    const page = await browser.newPage();
    let currentPage = 1;
    let hasNextPage = true;
    const products = [];
    const temp = {};

    while (hasNextPage) {
      const url = `${baseUrl}?sort=SALES&page=${currentPage}`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

      const content = await page.content();
      const $ = cheerio.load(content);

      const total = $('.total-items').text().trim().split(' ').pop();
      let totalPage = temp[categoryId] || Math.ceil(+total / 40);

      if (!temp[categoryId]) {
        temp[categoryId] = totalPage;
      }

      // console.log({a: temp[categoryId], b: Math.ceil(+total / 40), c: totalPage})
      // logger.info({ type: 'before', total: total[total.length - 1], currentPage, length: products.length });

      $('.productList-content .itemBlock').each(async (index, element) => {
        const title = $(element).find('.itemInfo h6').text().trim();
        const price = $(element)
          .find('.itemPrice-wrapper > p > span')
          .attr('data-price');

        const link = $(element).find('.itemInfo a').attr('href');
        const description = $(element).find('.itemFacts').text().trim();
        const imageSrc = $(element).find('.productImg img').attr('src');
        const info = $(element).find('.productInfo input').attr('data-gtm');

        if (info) {
          const item = JSON.parse(info);

          const url = `https://www.ikea.co.id${link}`;
          // const detail = await this.getProductDetail(url);

          products.push({
            ...item,
            title: title,
            price: price,
            link: url,
            description: description,
            // description: `${detail.description}. ${detail.benefit}`,
            image_url: imageSrc,
            category_id: categoryId,
            // images: detail?.images || [],
          });
        }
      });

      logger.info({
        type: categoryId,
        page: `${currentPage}/${totalPage}`,
        total: `${products.length}/${total}`,
      });

      const nextPageButton = $('.pagination .next');
      hasNextPage = !!nextPageButton.length;
      currentPage++;
    }

    return products;
  }

  async getProductDetail(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const name = $('.itemInfo h1 > div:first-child').text().trim();
    const description = $('.product-desc-wrapper p').text().trim();
    const benefit = $('#benefits .card-body')
      .text()
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .join(' ');

    const images = [];
    $('.slick-wrapper img').each((index, element) => {
      const image = $(element).attr('data-lazy');
      images.push(image);
    });

    return {
      name,
      description,
      benefit,
      images,
    };
  }

  async getBlog(browser) {
    const page = await browser.newPage();

    // Navigate to the target website
    await page.goto('https://www.ikea.co.id/in/inspirasi');

    // Define a function to scroll to the bottom of the page
    const scrollToBottom = async () => {
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    };

    // Perform the infinite scroll
    let id = 1;
    let previousHeight;
    while (true) {
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await scrollToBottom();
      // await page.waitForTimeout(2000); // Wait for new content to load

      let newHeight = await page.evaluate('document.body.scrollHeight');
      if (newHeight === previousHeight || id === 5) {
        break; // Exit the loop if no new content is loaded
      }

      id++;
    }

    const content = await page.content();
    await browser.close();
    const $ = cheerio.load(content);

    const data = [];
    $('#inspirationContainer .card').each((index, element) => {
      const imgSrc = $(element).find('a img').attr('data-src');
      const title = $(element).find('.card-title a').text().trim();
      const link = $(element).find('.card-title a').attr('href');

      data.push({
        title,
        external_id: Buffer.from(Buffer.from(link).toString('base64')).toString(
          'base64'
        ),
        link: `https://www.ikea.co.id${link}`,
        image_url: imgSrc,
      });
    });

    return data;
  }
}

module.exports = Ikea;
