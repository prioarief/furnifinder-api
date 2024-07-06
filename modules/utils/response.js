module.exports = (res, statusCode, message, paginate, result) => {
  const response = {
    code: [200, 201].includes(statusCode) ? 1 : 0,
    message: message,
  };

  if (paginate != null) {
    response.current_page = paginate.currentPage;
    response.total_page = paginate.totalPage;
    response.total_data = paginate.totalData;
  }

  response.data = result;

  res.status(statusCode).json(response);
};
