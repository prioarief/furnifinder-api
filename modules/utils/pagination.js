module.exports = async (req, totalData) => {
  const limit = req.query?.limit || 10
  const totalPage = Math.ceil(totalData / limit)
  const currentPage = req.query?.page || 1
  const perPage = (currentPage - 1) * limit
  const paginate = {
    currentPage: +currentPage,
    totalPage,
    totalData: totalData,
    perPage,
    limit,
  }

  return paginate
}
