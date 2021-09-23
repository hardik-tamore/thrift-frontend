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
    photo :String,
    selling_price : Number,
    customer : {
        name : String,
        user_name : String,
        phone: Number,
        email :String,
        address_1 : String,
        address_2 : String,
        pincode : Number,
        payment_mode : String
        
    }
    

}, { timestamps: true }
)

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
