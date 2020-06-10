const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

/*
{
     "name": "Weekend Grand Buffet",
     "image": "images/buffet.png",
     "label": "New",
     "price": "19.99",
     "description": "Featuring . . .",
     "featured": false
}
*/

const promoSchema = new Schema({
  name:{
    type: String,
    required : true,
  },
  image:{
    type: String,
    required: true
  },
  lable: {
    type: String,
    required: true
  },
  price:{
    type: Currency,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  featured:{
    type: String,
    required: false
  }
})

const Promotions = mongoose.model('Promotion',promoSchema);
module.exports = Promotions;
