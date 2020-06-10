const mongoose = require('mongoose');
/*
{
      "name": "Peter Pan",
      "image": "images/alberto.png",
      "designation": "Chief Epicurious Officer",
      "abbr": "CEO",
      "description": "Our CEO, Peter, . . .",
      "featured": false
}

*/
const leaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image : String,
  designation : String,
  abbr: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  featured: Boolean
},{timestamp: true});

var Leader = mongoose.model('Leader',leaderSchema);

module.exports = Leader;
