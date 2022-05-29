const mongoose = require('mongoose') 



const inventorySchema = new mongoose.Schema({

name : {
    type: String,
    required: [true, 'Please provide name'],
    minlength:  [3, "Name can't be less than 3 characters"],
    maxlength: [50, 'Name can not be more than 50 characters'],
},
amount : {
    type : Number,
    required : [true, 'Provide amount']
},
unit : {
    type : String,
    required : [true, 'Provide unit']
}, 
status : {
    type : String,
    default : null
},
warehouse : {
    type: mongoose.Schema.Types.ObjectId,
ref: 'Warehouse'
},
image : {
    type: Buffer
},


},{ 
    toObject: {
    transform: function (doc, ret) {
      delete ret.image;
    }
  },
  toJSON: {
    transform: function (doc, ret) {
      delete ret.image;
    }
  }
  }, {
    timestamps : true
})




module.exports = mongoose.model('Inventory', inventorySchema)
