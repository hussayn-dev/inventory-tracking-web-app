const express = require('express')
const router = express.Router()
const warehouse = require('../controllers/warehouse')
const {isLoggedIn, notLoggedIn, authorizeRoles} = require('../middleware/auth')
// user gets his warehouse and all inventories under it

router.get('/ware', isLoggedIn, warehouse.userGetWarehouse)
// Admin creates a warehouse and assigns it to a worker if available already

router.route('/create').post(isLoggedIn, authorizeRoles('admin'),warehouse.createWarehouse)
router.route('/wares').get(isLoggedIn, authorizeRoles('admin'),warehouse.getWarehouses)
router.route('/admin/:id')
.get(isLoggedIn, authorizeRoles('admin'),warehouse.getWarehouse)
.patch(isLoggedIn,authorizeRoles('admin'), warehouse.updateWarehouse)
.delete(isLoggedIn, authorizeRoles('admin'), warehouse.deleteWarehouse)





module.exports = router