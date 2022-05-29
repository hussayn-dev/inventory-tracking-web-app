const { StatusCodes } = require('http-status-codes')
const User = require('../models/user')
const {BadRequestError, NotFoundError} = require('../errors/error-handler')
const passport = require('passport')
const multer = require('multer')
const sharp = require('sharp')


//remains user avatar
exports.login  = async(req, res, next) => {

    if(!req.body.email || !req.body.password)throw new BadRequestError("input your details")
    req.body.email = req.body.email.toLowerCase()
     passport.authenticate('local')
     (req,res,next)
   
}
exports.getUsers = async(req, res) => { 
const users = await User.find({}).sort('-createdAt')
.select('name email  role')
if (!users) throw new NotFoundError('No users available')
res.status(StatusCodes.OK).json({data : users})

}
exports.getUser = async(req, res) => {
const {_id:UserId, name, email, role} = req.user
const user = { UserId, name, email, role }
if(!user) throw new NotFoundError('Info Not available')
res.status(StatusCodes.OK).json({data : user})
}
exports.updateUserInfo = async(req, res) => {
    const {id: UserId} = req.params
 const user = await User.findById(UserId)
 if(!user) throw new NotFoundError(`User with${UserId} not found`)
 const arr = ['name', 'email', 'password']
 arr.forEach(update => {
    if(req.body[update] !== undefined ) {
     user[update] = req.body[update]
    }
 })
 await user.save()
 res.status(StatusCodes.OK).json({data : user})
}
exports.getUserInfo = async(req, res)=> {
const user = await User.findOnebyId(req.params.id)
if(!user) throw new NotFoundError('No user with that Id')
res.status(StatusCodes.OK).json({data : user})
}
exports.updateUser= async(req, res) => {
if(!req.user) throw new NotFoundError('No user')
   const arr = ['name', 'email', 'password']
   arr.forEach(update => {
    if(req.body[update] !== undefined ) {
        req.user[update] = req.body[update]
       }
   })
await req.user.save()
res.status(StatusCodes.OK).json({data : req.user})
}
exports.deleteUser = async(req, res) => {
 const user = await User.findByIdAndDelete(req.params.id)
 if(!user) throw new NotFoundError('User not found')
 res.status(StatusCodes.OK).json({data : user})
}

exports.createUser = async(req, res) => {
   const {email, name,password} = req.body
   const isFirstAccount = (await User.countDocuments({})) === 0;
   const role = isFirstAccount ? 'admin' : 'user';
    const user =  new User({email, name, password, role})
    if(!name || !email) throw new BadRequestError('enter input fields')
    const userExist = await User.findOne({email})
    if(userExist) throw new BadRequestError('User exists, Try logging in')
await user.save()
    res.status(201).json({data : user})
}
exports.logout = async(req, res) => {
req.logOut()
}
const upload = multer({
    limits : {
  fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png |jpeg |jpg)$/)) {
            return cb(new BadRequestError('Please upload an image'))
        }
        cb(undefined, true)
    }
     
})
exports.startupload = upload.single('avatar')
exports.uploadAvatar = async (req, res) => {
  if(!req.file) throw new BadRequestError('Upload an image')
    const buffer = await sharp(req.file.buffer).resize(
                {width: 200, height: 200}).png().toBuffer()
               
                req.user.avatar = buffer
        await req.user.save()
        res.status(StatusCodes.CREATED).json({message : 'image created successfully'})
}
exports.getAvatar = async (req, res) => {
    if(!req.user.avatar) {
   throw new NotFoundError('image not found')
    }
res.set('Content-Type', 'image/png')
res.send(req.user.avatar)
}
exports.deleteAvatar = async (req, res) => {
        req.user.avatar = undefined;
      await  req.user.save()
      res.status(StatusCodes.OK).json({message: 'Deleted sucessfully'})
    
}
exports.editAvatar = async (req, res) => {
    if(!req.file) throw new BadRequestError('Upload an image')
    const buffer = await sharp(req.file.buffer).resize(
                {width: 200, height: 200}).png().toBuffer()
               
                req.user.avatar = buffer
        await req.user.save()
        res.status(StatusCodes.CREATED).json({message : 'image edited successfully'})
}