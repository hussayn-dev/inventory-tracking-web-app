const express = require('express')
const router = express.Router()
const inventory = require('../controllers/inventories')
const {isLoggedIn, notLoggedIn, authorizeRoles} = require('../middleware/auth')


// router.use(isLoggedIn)

 // user
 router.get('/invent', inventory.getReceivedInventories)
 router.get('/user/:id', inventory.getSingleInventory)

//  router.use(authorizeRoles('admin'))
// admin
router.post('/create', isLoggedIn, authorizeRoles('admin'), inventory.createInventory)
router.post('/send',isLoggedIn, authorizeRoles('admin'), inventory.sendInventory)
router.route('/inventories').get(isLoggedIn, authorizeRoles('admin'), inventory.getStaticInventories)
router.route('/sentinventories').get(isLoggedIn, authorizeRoles('admin'), inventory.getSentInventories) //pending results
router.route('/admin/:id')
.get(isLoggedIn, authorizeRoles('admin'),inventory.getAnInventory)
.patch(isLoggedIn, authorizeRoles('admin'),inventory.editStaticInventory)
.delete(isLoggedIn, authorizeRoles('admin'), inventory.deleteInventory)
router.get('/wareinventories/:id', isLoggedIn, authorizeRoles('admin'), inventory.getWareSentInventories)

router.route('/image/:id').post(isLoggedIn, authorizeRoles('admin'), inventory.uploadImage).get(isLoggedIn, inventory.deleteImage).delete(isLoggedIn,authorizeRoles('admin'), inventory.deleteImage).patch(isLoggedIn, authorizeRoles('admin'), inventory.editImage)
module.exports = router