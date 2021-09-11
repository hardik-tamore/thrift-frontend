const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({

    Name : String,
    Status : String,
    Price : Number,
    Cost : Number,
    Size: String,
    Condition : Number,
    Condition_desc : String,
    Chest : Number,
    Length : Number,
    Shoulder : Number,
    photo :String


})

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
