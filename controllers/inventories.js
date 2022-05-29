const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors/error-handler')
const Inventory = require('../models/inventories')
const Warehouse = require('../models/warehouse')
const multer = require('multer')
const sharp = require('sharp')

exports.createInventory = async(req, res) => {
   const {name, amount, unit} = req.body
   if(!name || !amount || !unit) throw new BadRequestError('enter input fields')
   const inventoryExist = await Inventory.findOne({name})
    if(inventoryExist) throw new BadRequestError('Inventory exists, Use another name')
    const inventory =  new Inventory({name, amount, unit})
    await inventory.save()
    res.status(StatusCodes.CREATED).json({data : inventory})
}
exports.sendInventory = async(req, res) => {
   let {amount, name, warehouse} = req.body
   const ware = await Warehouse.findOne({name: warehouse}).select('name location')
   if(!ware) throw new notFoundError(`No warehouse with name ${warehouse} exists`)
   const inventory = await Inventory.findOne({name})
   if(!inventory) throw new notFoundError(`No inventory with name ${name} exists`)
inventory.amount = Number(inventory.amount) - Number(amount)
amount = Number(amount)
warehouse = ware._id
const status = 'pending'
const unit = inventory.unit
const newInventory = new Inventory({name, amount,unit, status, warehouse})
await inventory.save()
await newInventory.save()
res.status(StatusCodes.CREATED).json({
    data : {inventory, newInventory, message : `${amount} is on its way to ${ware.name}`}
})
}
exports.getStaticInventories = async(req, res) => {
    const inventories=  await Inventory.find({status : null}).sort('-createdAt')
  if(!inventories) throw new notFoundError('No inventory available')
  res.status(StatusCodes.OK).json({data : inventories})

}

exports.getSentInventories = async(req, res) => {
  const   status = 'pending' || 'received'
    const inventories=  await Inventory.find({status}).sort('-createdAt').select('name amount unit status')
    if(!inventories) throw new NotFoundError('No inventory available')
    res.status(StatusCodes.OK).json({data : inventories})
}
exports.getAnInventory = async(req, res) => {
    const inventory = await Inventory.findById(req.params.id).select('name amount unit status')
    if(!inventory) throw new NotFoundError(`No inventory with Id ${req.params.id} found`)
    res.status(StatusCodes.OK).json({data : inventory})
}
exports.editStaticInventory = async(req, res) => {
    const inventory = await Inventory.findOne({_id :req.params.id, status : null})
    if(!inventory) throw new NotFoundError(`No inventory with Id ${req.params.id} found`)

const {amount, unit, name} = req.body
if(amount) {
    inventory.amount += amount;
}
if(unit || name) {
    const arr = ['name', 'unit']
    arr.forEach(update => {

        if(req.body[update] !== undefined) {
            inventory[update] = req.body[update]
       }
    })
}
await inventory.save()
res.status(StatusCodes.OK).json({data :{message : 'Updated successfully', inventory}})

}
exports.deleteInventory = async(req, res) => {
   const inventory = await Inventory.findByIdAndDelete(req.params.id)
   if(!inventory) throw new NotFoundError(`couldn't find inventory with ID ${req.params.id}` )
   res.status(StatusCodes.OK).json({data : inventory}) 
}
exports.getWareSentInventories = async(req, res) => {
    const warehouse = await Warehouse.findById(req.params.id)
    if(!warehouse) throw new NotFoundError(`warehouse with ID${req.params.id} found`)
    await warehouse.populate({
        path : "inventories",
        select : "name amount unit"
    })
    res.status(StatusCodes.OK).json({data : warehouse.inventories})
}
exports.getReceivedInventories = async(req, res) => {
    const warehouse = await Warehouse.findOne({userId : req.user._id})
    if(!warehouse) throw new NotFoundError("You haven't been assigned a warehouse")
    await warehouse.populate({
        path : "inventories",
        select : "name amount unit"
    })
    res.status(StatusCodes.OK).json({data : warehouse.inventories})
}
exports.getSingleInventory = async(req, res) => {
    const warehouse = await Warehouse.findOne({userId : req.user._id})
    if(!warehouse) throw new NotFoundError("You haven't been assigned a warehouse")
    await warehouse.populate({
        path : "inventories",
        select : "name amount unit"
    })
 const newwarehouse = warehouse.inventories.filter((inventory) => inventory.warehouse === req.params.id)
const data = newwarehouse[0]
if(!data) throw new NotFoundError(`Inventory with ID ${req.params.id} can't be found`)
res.status(StatusCodes.OK).json({data})
}
// photograph of inventory
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
exports.startupload = upload.single('image')
exports.uploadImage = async (req, res) => {
    const {InventoryID} = req.params.id
  if(!req.file) throw new BadRequestError('Upload an image')
    const buffer = await sharp(req.file.buffer).resize(
                {width: 200, height: 200}).png().toBuffer()
       const inventory = await Inventory.findById(InventoryID)   
       if(!inventory) throw new NotFoundError(`Inventory with ID ${InventoryID} notfound `)  
                inventory.image = buffer
        await inventory.save()
        res.status(StatusCodes.CREATED).json({message : 'image created successfully'})
}
exports.getImage = async (req, res) => {
    const {InventoryID} = req.params.id
    const inventory = await Inventory.findById(InventoryID)
    if(!inventory) throw new NotFoundError(`Inventory with ID ${InventoryID} notfound `)
    if(!inventory.image) throw new NotFoundError('No image found')
    res.set('Content-Type', 'image/png')
res.send(inventory.image)
}
exports.deleteImage = async (req, res) => {
    const {InventoryID} = req.params.id
    const inventory = await Inventory.findById(InventoryID)    
    if(!inventory) throw new NotFoundError(`Inventory with ID ${InventoryID} notfound `) 
        inventory.image = undefined;
      await  inventory.save()
      res.status(StatusCodes.OK).json({message: ' Image deleted sucessfully'})
    
}
exports.editImage = async (req, res) => {
    const {InventoryID} = req.params.id
    if(!req.file) throw new BadRequestError('Upload an image')
      const buffer = await sharp(req.file.buffer).resize(
                  {width: 200, height: 200}).png().toBuffer()
         const inventory = await Inventory.findById(InventoryID)     
                  inventory.image = buffer
          await inventory.save()
          res.status(StatusCodes.CREATED).json({message : 'Image edited successfully'})
}

// enabling filter pagination and search queries