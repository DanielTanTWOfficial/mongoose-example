var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    storename: String,
    address: String
 });
 
 module.exports = mongoose.model("Product", productSchema);