const newError = (statusCode, message) => {
  const customError = new Error()
  customError.status = statusCode
  customError.message = message

  return customError
}

module.exports = newError
