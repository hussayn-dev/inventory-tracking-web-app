const { StatusCodes} = require('http-status-codes')

const notFound = (req, res) => {
    res.status(StatusCodes.NOT_FOUND).send('Route not found')
}

const errorHandler = (err, req, res, next) => {
    let customError = {
        message : err.message || 'Something went wrong, try again later',
        status : err.statusCode || 500
    }


    if (err.name === 'ValidationError') {
        customError.message = Object.values(err.errors)
          .map((item) => item.message)
          .join(',') 
        customError.status = 400
      }
      if (err.code && err.code === 11000) {
        customError.message = `Duplicate value entered for ${Object.keys(
          err.keyValue
        )} field, please choose another value`
        customError.status = 400
      }
      if (err.name === 'CastError') {
        customError.message = `No item found with id : ${err.value}`
        customError.status = 404
      }
    



    res.status(customError.status).json({message : customError.message})
}

module.exports = {
    notFound, errorHandler
}