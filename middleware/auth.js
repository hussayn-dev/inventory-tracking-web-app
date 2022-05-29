const {UnauthorizedError, BadRequestError} = require('../errors/error-handler')

const isLoggedIn = (req, res,next) => {
    if(req.isAuthenticated()) {
        return next()
    }
next(new BadRequestError('Login First'))
}
const notLoggedIn = (req, res, next) => {
if(!req.isAuthenticated()) {
    return next()
}
next(new BadRequestError("Can't login twice"))
}
const authorizeRoles = (...role) => {
    return (req, res, next) => {
      if (!role.includes(req.user.role)) throw new UnauthorizedError('Unauthorized to access this route');
      
      next();


    };
  };

module.exports = {
    isLoggedIn, notLoggedIn, authorizeRoles
}