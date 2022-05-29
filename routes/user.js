const express = require('express')
const { StatusCodes } = require('http-status-codes')
const router = express.Router()
const user = require('../controllers/user')
const {isLoggedIn, notLoggedIn, authorizeRoles} = require('../middleware/auth')
const upload = require('../controllers/user')
// fix the edit passsword


router.route('/login').post(notLoggedIn,user.login, (req, res) => {
    res.status(StatusCodes.OK).json({data : req.user})
})
router.route('/register').post(notLoggedIn,user.createUser)
router.post('/logout',isLoggedIn, user.logout)
router.route('/get').get(user.getUsers)
router.route('/userInfo/:id').get(isLoggedIn,user.getUserInfo).patch(isLoggedIn, user.updateUserInfo).delete(user.deleteUser)
router.route('/admin/:id').get(isLoggedIn,user.getUser).patch(isLoggedIn,user.updateUser)
router.route('/avatar').post(isLoggedIn,user.startupload, user.uploadAvatar).get(isLoggedIn, user.getAvatar).delete(isLoggedIn, user.deleteAvatar).patch(isLoggedIn, user.editAvatar).get(isLoggedIn, user.getAvatar)


router.use(notLoggedIn)
module.exports = router