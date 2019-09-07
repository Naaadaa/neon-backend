const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Product = new Schema({
    name: {
        type: String
    },
    color: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: String
    },
    description:{
        type: String
    }

});

module.exports = mongoose.model('Product', Product);