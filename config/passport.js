const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const {NotFoundError, BadRequestError} = ('../errors/error-handler.js')
const User = require('../models/user')


function initialize (passport) {
    const authenticateUser= async (email, password, done) => {
  try {
 
    const user  = await User.findOne({email})
    if(!user) return done({message : "Email doesn't exist", statusCode : 400})
    if(await bcrypt.compare(password, user.password)) return done(null, user)
    else  return done({message : 'Password incorrect', statusCode : 400})
    
  }
     catch(errror) {
         done(error)
     }  
} 
    
passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser(async (id, done) => done(null, await User.findById(id)))

}
module.exports = initialize
