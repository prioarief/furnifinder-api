const newError = require('./new_error')

module.exports = (schema, req, allowUnknown = false) => {
  const { error } = schema.validate(req, {
    abortEarly: false,
    allowUnknown,
  })

  if (error) {
    const errorResponse = error.details.map((e) => e.message)
    const errorMsg =
      errorResponse.length > 1
        ? errorResponse.slice(0, -1).join(', ') + ' and ' + errorResponse.slice(-1)
        : errorResponse.join(',')

    throw newError(400, errorMsg)
  }
}
