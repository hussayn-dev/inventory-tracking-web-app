const Warehouse = require('../models/warehouse')
const User = require('../models/user')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors/error-handler')

// Remember the queries , create A pagination

exports.createWarehouse = async(req, res) => {
    const {name, location, user} = req.body
    let userId;
    if(!name || !location) throw new BadRequestError('enter input fields')
    const wareHouseExist = await Warehouse.findOne({name})
    if(wareHouseExist) throw new BadRequestError('Warehouse exists, Use another name')
        if(user === 'none' || user === undefined) {
            userId = '6272a64dde5624a8878f1a9e'
        } 
        else {
            const use = await User.findOne({name : user}) 
            if(!use) throw new NotFoundError(`No user with the name ${user}`)
            userId = use._id
        }

    const warehouse = new Warehouse({name, location, userId})
await warehouse.save()
res.status(StatusCodes.CREATED).json({data : warehouse})

}
exports.getWarehouses = async(req, res) => {
let username;
    const newwarehouses = await Warehouse.find({}).sort('-createdAt').select('name location userId').populate('userId', 'name')
    if(!newwarehouses) throw new NotFoundError('No warehouses available yet')

let warehouse = [ ];
newwarehouses.forEach(update => {
    if(!update.userId) {
        username = "None yet"
    } else {
        username = update.userId.name
    }
    warehouse.push({update, username})
})

    res.status(StatusCodes.OK).json({
        data : {
            warehouse
        }
    })
}
exports.getWarehouse = async(req, res) => {
    const warehouse = await Warehouse.findById(req.params.id)
    if(!warehouse) throw new NotFoundError(`No warehouse with ID ${req.params.id} found`)
    res.status(StatusCodes.OK).json({data :  warehouse})
}
exports.updateWarehouse = async(req, res) => {
    const {id: WarehouseId} = req.params
    const warehouse = await Warehouse.findById(WarehouseId)
    if(!warehouse)  throw new NotFoundError(`Warehouse with ${WarehouseId} not found`)
    if(req.body.user) {
        const use = await User.findOne({name : req.body.user})

        req.body.userId = use._id
    }

    const arr = ['name', 'location', 'userId']
    arr.forEach(update => {
        if(req.body[update]  !== undefined) {
            warehouse[update] = req.body[update]
        }
     })
     await warehouse.save()
     res.status(StatusCodes.OK).json({data : warehouse})
    
}

// consider all get routes by adding req.queries

exports.deleteWarehouse = async(req, res) => {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id)
    if(!warehouse) throw new NotFoundError(`No warehouse with ID ${req.params.id} found`)
    res.status(StatusCodes.OK).json({stautus : 'deleted successfully' ,data :  warehouse})
}
exports.userGetWarehouse =async (req, res) => {
const warehouse = await Warehouse.findOne({userId : req.user._id})
if(!warehouse) throw new NotFoundError('You do not have a warehouse yet')
}