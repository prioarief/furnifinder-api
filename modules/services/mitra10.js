const { default: axios } = require('axios');
const { MITRA10_GRAPHQL_URL = 'https://web.mitra10.com/graphql' } = process.env;

class Mitra10 {
  async getCategories() {
    try {
      const query = `
        query Categories {
          categories {
            home_category {
              id
              image_icon
              image_icon_ecatalog
              name
              url_key
            }
          }
        }
      `;

      const { data } = await axios.post(MITRA10_GRAPHQL_URL, { query });
      return (data.data?.categories?.home_category || []).map((e) => ({
        external_id: e.id,
        name: e.name,
      }));
    } catch (error) {
      return error;
    }
  }

  async getProducts(categoryId, limit = 10, page = 1) {
    try {
      const query = `
        query Products {
          products(filter: { category_id: { eq: "${categoryId}" } }, pageSize: ${limit}, currentPage: ${page}) {
            total_count
            page_info {
              current_page
              page_size
              total_pages
            }
            items {
              brand
              brand_name
              description {
                html
              }
              name
              rating_summary
              review {
                rating_summary
                reviews_count
              }
              reviews(pageSize: 5) {
                items {
                  text
                  summary
                  nickname
                  created_at
                  average_rating
                  text
                }
              }
              sku
              special_price
              review_count
              small_image {
                url
              }
              link_video
              media_gallery {
                url
                url_original
                position
                label
                disabled
              }
              url_key
              stock_status
            }
          }
        }
      `;

      const { data } = await axios.post(MITRA10_GRAPHQL_URL, { query });
      const { page_info, items } = data.data?.products;

      return { page_info, items };
    } catch (error) {
      return error;
    }
  }
}

module.exports = Mitra10;
