const mongoose = require('mongoose')
const warehouseSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please provide name'],
        minlength: [3, "Name can't be less than 3 characters"],
        maxlength: [50, 'Name can not be more than 50 characters'],
      },
      location  : {
         type: String, 
        required : [true, 'Please provide a location'],
        minlength: [3, "Location can't be less than 3characters"],
       maxlength: [50, "Location can't be more than 50 characters"],

      }, 
      userId: {
        type:   mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User',
      
}}, {
    timestamps : true
})
warehouseSchema.virtual('inventories', {
  ref: 'Inventory',
  localField: '_id',
  foreignField: 'warehouse',
});



module.exports = mongoose.model('Warehouse', warehouseSchema)